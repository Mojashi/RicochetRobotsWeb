import { Dispatch } from "redux";
import { User, UserID } from "../../../model/User";
import { notify, tellUser } from "../../GameSlice";
import { MessageType, ServerMessage, SJoin, SNotify, SSetPoint, STellUser } from "../WebsocketEventHandler";
import { ServerHiddenSubmissionDto } from "./addHiddenSubmissionMessage";
import { ServerSubmissionDto } from "./addSubmissionMessage";


export class NotifyMessage implements ServerMessage {
    type:MessageType = SNotify
    msg! : string

    constructor(init: NotifyMessage) {
        Object.assign(this, init);
    }
    handle(dispatch : Dispatch<any>){
        dispatch(notify(this.msg))
    }
}
