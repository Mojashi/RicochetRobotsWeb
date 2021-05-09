import { GameConfig } from "../../../model/game/GameConfig"
import { ClientMessage, CNextProblem, CStart, CSubmit, MessageType } from "../WebsocketEventHandler"

export class NextProblemRequestMessage implements ClientMessage {
    type:MessageType = CNextProblem
    constructor(){
    }
    toJSON(){
        return {
            type:this.type,
        }
    }
}