import { Dispatch } from "redux";
import { Hands } from "../../../model/game/Hands";
import { User, UserID } from "../../../model/User";
import { notify, setHint, tellUser } from "../../GameSlice";
import { MessageType, ServerMessage, SHint, SJoin, SNotify, SSetPoint, STellUser } from "../WebsocketEventHandler";
import { ServerHiddenSubmissionDto } from "./addHiddenSubmissionMessage";
import { ServerSubmissionDto } from "./addSubmissionMessage";


export class SetHintMessage implements ServerMessage {
    type:MessageType = SHint
    hands! : Hands

    constructor(init: SetHintMessage) {
        Object.assign(this, init);
    }
    handle(dispatch : Dispatch<any>){
        dispatch(setHint(this.hands))
    }
}
