package model

type RoomInfo struct {
	ID         int        `json:"id"`
	GameConfig GameConfig `json:"gameConfig"`
	Admin      User       `json:"admin"`
	OnGame     bool       `json:"onGame"`
	RoomSettings
}

type RoomSettings struct {
	Name     string `json:"name"`
	Private  bool   `json:"private"`
	Password string `json:"password"`
}

type RoomAbstract struct {
	ID           int          `json:"id"`
	Name         string       `json:"name"`
	Private      bool         `json:"private"`
	GameConfig   GameConfig   `json:"gameConfig"`
	OnGame       bool         `json:"onGame"`
	Participants map[int]User `json:"participants"`
}

func (r *RoomInfo) ToAbstract(participants map[int]User) RoomAbstract {
	return RoomAbstract{
		ID:           r.ID,
		Name:         r.Name,
		Private:      r.Private,
		GameConfig:   r.GameConfig,
		OnGame:       r.OnGame,
		Participants: participants,
	}
}

func (r *RoomAbstract) Copy() RoomAbstract {
	np := map[UserID]User{}
	for k, v := range r.Participants {
		np[k] = v
	}
	return RoomAbstract{
		ID:           r.ID,
		Name:         r.Name,
		Private:      r.Private,
		GameConfig:   r.GameConfig,
		OnGame:       r.OnGame,
		Participants: np,
	}
}
