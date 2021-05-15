import { GameConfig } from "../../../model/game/GameConfig"
import { ClientMessage, CRequestHint, CStart, CSubmit, MessageType } from "../WebsocketEventHandler"

export class RequestHintMessage implements ClientMessage {
    type:MessageType = CRequestHint
    constructor(){
    }
    toJSON(){
        return {
            type:this.type,
        }
    }
}