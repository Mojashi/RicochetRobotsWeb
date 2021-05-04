import { Dispatch } from "redux";
import { Submission } from "../../../model/game/Submission";
import { finishProblem, finishProblemFromServer, setShortestFromServer } from "../../GameSlice";
import { MessageType, ServerMessage, SFinishGame, SFinishProblem, SSetShortest } from "../WebsocketEventHandler";
import { ServerHiddenSubmissionDto } from "./addHiddenSubmissionMessage";
import { AddSubmissionMessage, ServerSubmissionDto } from "./addSubmissionMessage";
import { SetPointMessage } from "./setPointMessage";


export class FinishProblemMessage implements ServerMessage {
    type:MessageType = SFinishProblem
    subs!:ServerSubmissionDto[]

    constructor(init: FinishProblemMessage) {
        Object.assign(this, init);
        for(var i = 0; init.subs.length > i; i++)
            this.subs[i] = new ServerSubmissionDto(init.subs[i])
    }
    
    handle(dispatch : Dispatch<any>){
        dispatch(finishProblemFromServer(this.subs))
    }
}
