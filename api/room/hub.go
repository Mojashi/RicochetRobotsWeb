package room

import "log"

type Hub struct {
	clients    map[*Client]bool
	Broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
}

func NewHub() *Hub {
	return &Hub{
		Broadcast:  make(chan []byte, 512),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (h *Hub) Run(joinHandler func(*Client) error, leaveHandler func(*Client) error) {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
			if err := joinHandler(client); err != nil {
				log.Print(err)
			}
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				leaveHandler(client)
				delete(h.clients, client)
				close(client.Send)
			}
		case message := <-h.Broadcast:
			for client := range h.clients {
				select {
				case client.Send <- message:
				default:
					close(client.Send)
					delete(h.clients, client)
				}
			}
		}
	}
}
