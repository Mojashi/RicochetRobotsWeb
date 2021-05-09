import { Dispatch } from "redux";
import { User, UserID } from "../../../model/User";
import { joinToRoom } from "../../GameSlice";
import { MessageType, ServerMessage, SJoin, SSetPoint } from "../WebsocketEventHandler";
import { ServerHiddenSubmissionDto } from "./addHiddenSubmissionMessage";
import { ServerSubmissionDto } from "./addSubmissionMessage";

//これはtellUserとjoinの合体したメッセージなんだけどほとんどのユースケースでこう使うので合体した概念を用意しています、でも分割したほうがきれいだね
export class JoinMessage implements ServerMessage {
    type:MessageType = SJoin
    user! : User

    constructor(init: JoinMessage) {
        Object.assign(this, init);
    }
    handle(dispatch : Dispatch<any>){
        dispatch(joinToRoom(this.user))
    }
}
