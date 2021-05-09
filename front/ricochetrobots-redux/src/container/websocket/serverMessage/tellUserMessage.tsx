import { Dispatch } from "redux";
import { User, UserID } from "../../../model/User";
import { tellUser } from "../../GameSlice";
import { MessageType, ServerMessage, SJoin, SSetPoint, STellUser } from "../WebsocketEventHandler";
import { ServerHiddenSubmissionDto } from "./addHiddenSubmissionMessage";
import { ServerSubmissionDto } from "./addSubmissionMessage";


export class TellUserMessage implements ServerMessage {
    type:MessageType = STellUser
    user! : User

    constructor(init: TellUserMessage) {
        Object.assign(this, init);
    }
    handle(dispatch : Dispatch<any>){
        dispatch(tellUser(this.user))
    }
}
