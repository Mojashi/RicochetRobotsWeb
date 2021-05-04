import { Hands } from "../../../model/game/Hands"
import { Submission } from "../../../model/game/Submission"
import { ClientMessage, CSubmit, MessageType } from "../WebsocketEventHandler"

type SubmitMsgDto = {
	hands : Hands
}

export class SubmitMessage implements ClientMessage {
    type:MessageType = CSubmit
    sub : SubmitMsgDto
    constructor(hands : Hands){
        this.sub = {hands}
    }

    toJSON(){
        return {
            type:this.type,
            sub:this.sub,
        }
    }
}