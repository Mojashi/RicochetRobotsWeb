package arena

import "github.com/Mojashi/RicochetRobotsWeb/api/game"

type ClientEvent struct {
	//EventName string `json:"event_name"`

	Submit *SubmitCEvent `json:"submit,omitempty"`
	// Join   *JoinCEvent   `json:"join"`
}

type SubmitCEvent struct {
	Hands []game.Hand `json:"hands"`
}

// type JoinCEvent struct {
// }
