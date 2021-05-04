import { Dispatch } from "redux";
import { User, UserID } from "../../../model/User";
import { join, leave } from "../../GameSlice";
import { MessageType, ServerMessage, SJoin, SLeave, SSetPoint } from "../WebsocketEventHandler";
import { ServerHiddenSubmissionDto } from "./addHiddenSubmissionMessage";
import { ServerSubmissionDto } from "./addSubmissionMessage";


export class LeaveMessage implements ServerMessage {
    type:MessageType = SLeave
    userID! : UserID

    constructor(init: LeaveMessage) {
        Object.assign(this, init);
    }
    handle(dispatch : Dispatch<any>){
        dispatch(leave(this.userID))
    }
}
