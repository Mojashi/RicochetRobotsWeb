import { Dispatch } from "redux";
import { MessageType, SStartGame } from "../WebsocketEventHandler";
import {startGame} from "../../GameSlice"
export class StartGameMessage {
    type : MessageType = SStartGame
    gameID! : number
    constructor(init: StartGameMessage) {
        Object.assign(this, init)
    }
    handle(dispatch : Dispatch<any>){
        dispatch(startGame(this.gameID))
    }
}