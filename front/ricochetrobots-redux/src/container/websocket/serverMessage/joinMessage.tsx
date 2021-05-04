import { Dispatch } from "redux";
import { User, UserID } from "../../../model/User";
import { join } from "../../GameSlice";
import { MessageType, ServerMessage, SJoin, SSetPoint } from "../WebsocketEventHandler";
import { ServerHiddenSubmissionDto } from "./addHiddenSubmissionMessage";
import { ServerSubmissionDto } from "./addSubmissionMessage";


export class JoinMessage implements ServerMessage {
    type:MessageType = SJoin
    user! : User

    constructor(init: JoinMessage) {
        Object.assign(this, init);
    }
    handle(dispatch : Dispatch<any>){
        dispatch(join(this.user))
    }
}
