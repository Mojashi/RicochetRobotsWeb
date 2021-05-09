import { Hands } from "../../../model/game/Hands"
import { Submission } from "../../../model/game/Submission"
import { CJoin, ClientMessage, CSubmit, MessageType } from "../WebsocketEventHandler"

type SubmitMsgDto = {
	hands : Hands
}

export class JoinMessage implements ClientMessage {
    type:MessageType = CJoin
    password : string
    constructor(password? : string){
        this.password = password ? password : ""
    }

    toJSON(){
        return {
            type:this.type,
            password : this.password
        }
    }
}