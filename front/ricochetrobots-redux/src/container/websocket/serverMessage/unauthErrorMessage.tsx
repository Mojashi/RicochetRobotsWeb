import { Dispatch } from "redux";
import { User, UserID } from "../../../model/User"
import { failedToAuth, leaveFromRoom, notify, setNeedToAuth } from "../../GameSlice";
import { MessageType, ServerMessage, SJoin, SLeave, SSetPoint, SUnauth } from "../WebsocketEventHandler";
import { ServerHiddenSubmissionDto } from "./addHiddenSubmissionMessage";
import { ServerSubmissionDto } from "./addSubmissionMessage";

export class UnauthErrorMessage implements ServerMessage {
    type:MessageType = SUnauth

    constructor(init: UnauthErrorMessage) {
        Object.assign(this, init);
    }
    handle(dispatch : Dispatch<any>){
        dispatch(failedToAuth())
    }
}
