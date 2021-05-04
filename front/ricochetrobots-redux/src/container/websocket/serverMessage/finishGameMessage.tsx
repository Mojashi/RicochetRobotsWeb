import { Dispatch } from "redux";
import { finishGame, setShortestFromServer } from "../../GameSlice";
import { MessageType, ServerMessage, SFinishGame, SSetShortest } from "../WebsocketEventHandler";
import { ServerHiddenSubmissionDto } from "./addHiddenSubmissionMessage";
import { AddSubmissionMessage, ServerSubmissionDto } from "./addSubmissionMessage";
import { SetPointMessage } from "./setPointMessage";


export class FinishGameMessage implements ServerMessage {
    type:MessageType = SFinishGame

    constructor(init: FinishGameMessage) {
        Object.assign(this, init);
    }
    handle(dispatch : Dispatch<any>){
        dispatch(finishGame())
    }
}
