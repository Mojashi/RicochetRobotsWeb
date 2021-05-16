package handler

import (
	"bytes"
	"encoding/json"
	"log"
	"strconv"
	"sync/atomic"
	"time"

	"github.com/Mojashi/RicochetRobots/api/app"
	"github.com/Mojashi/RicochetRobots/api/app/messages/clientMessage"
	"github.com/Mojashi/RicochetRobots/api/app/messages/serverMessage"
	"github.com/Mojashi/RicochetRobots/api/model"
	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 2048
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

// implements usecase.Client
type WsClient struct {
	room app.IRoomApp

	// The websocket connection.
	conn *websocket.Conn

	// Buffered channel of outbound messages.
	send chan []byte

	user model.User

	sentMsgCnt int32
}

func (c *WsClient) readPump() {
	defer func() {
		c.Delete()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))
		c.Handle(message)
	}
}

// writePump pumps messages from the hub to the websocket connection.
//
// A goroutine running writePump is started for each connection. The
// application ensures that there is at most one writer to a connection by
// executing all writes from this goroutine.
func (c *WsClient) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			log.Println("send:" + string(message))
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func NewClient(conn *websocket.Conn, user model.User) (*WsClient, error) {
	client := &WsClient{conn: conn, send: make(chan []byte, 512), user: user}
	return client, nil
}

func (c *WsClient) Send(msg serverMessage.ServerMessage) error {
	msgID := atomic.AddInt32(&c.sentMsgCnt, 1)
	msgBytes, err := json.Marshal(msg)
	if err != nil {
		return err
	}

	buf := bytes.NewBuffer(make([]byte, 0, len(msgBytes)+10))
	buf.Write([]byte(strconv.Itoa(int(msgID))))
	buf.Write([]byte(","))
	buf.Write(msgBytes)

	c.send <- buf.Bytes()
	return nil
}
func (c *WsClient) GetUser() model.User {
	return c.user
}
func (c *WsClient) Delete() error {
	app.SendLeave(c.room, c)
	c.conn.Close()
	return nil
}

func (c *WsClient) Run(r app.IRoomApp) error {
	c.room = r
	go c.writePump()
	go c.readPump()

	app.SendJoin(r, c)
	return nil
}

func (c *WsClient) Handle(msg []byte) error {
	cmsg, err := clientMessage.ToClientMessage(msg)
	log.Print(string(msg))
	if err != nil {
		return err
	}
	c.room.SendMessage(c, cmsg)
	return nil
}
