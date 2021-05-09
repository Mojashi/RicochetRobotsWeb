import { GameConfig } from "./game/GameConfig";
import { User } from "./User";

export type RoomInfo = {
    id : number
    name : string
    gameConfig : GameConfig
    admin : User
    onGame : boolean
}