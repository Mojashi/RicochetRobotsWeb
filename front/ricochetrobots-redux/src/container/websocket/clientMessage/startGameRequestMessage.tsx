import { ClientMessage, CStart, CSubmit, MessageType } from "../WebsocketEventHandler"

export class StartGameRequestMessage implements ClientMessage {
    type:MessageType = CStart
    constructor(){
    }
    toJSON(){
        return {
            type:this.type,
        }
    }
}