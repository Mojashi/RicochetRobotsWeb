import { GameConfig } from "./game/GameConfig";
import { User } from "./User";

export type RoomSettings = {
    name : string
    private : boolean
    password : string
}

export type RoomInfo = {
    id : number
    name : string
    gameConfig : GameConfig
    admin : User
    onGame : boolean
}