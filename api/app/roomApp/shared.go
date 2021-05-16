package roomApp

import (
	"github.com/Mojashi/RicochetRobots/api/app"
	"github.com/Mojashi/RicochetRobots/api/app/messages/clientMessage"
)

type MsgWithSender struct {
	Sender     app.Client
	Msg        clientMessage.ClientMessage
	SystemMade bool
}
