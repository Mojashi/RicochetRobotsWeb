import { Dispatch } from "redux";
import { Hands } from "../../../model/game/Hands";
import { Submission, SolutionHash, ResultSubmission } from "../../../model/game/Submission";
import { UnknownUser, UserID } from "../../../model/User";
import { finishProblem, finishProblemFromServer, ParticipantsDict, setShortestFromServer } from "../../GameSlice";
import { MessageType, ServerMessage, SFinishGame, SFinishProblem, SSetShortest } from "../WebsocketEventHandler";
import { ServerHiddenSubmissionDto } from "./addHiddenSubmissionMessage";
import { AddSubmissionMessage, ServerSubmissionDto } from "./addSubmissionMessage";
import { SetPointMessage } from "./setPointMessage";

export class ServerResultSubmissionDto {
    solHash! : SolutionHash
    addedPoint! : number
    id! : number
    userID! : UserID
    hands! : Hands
    optimal! : boolean
    timeStamp!:number

    constructor(init: ServerResultSubmissionDto) {
        Object.assign(this, init);
    }
    toSubmission = (isFirst : boolean, users? : ParticipantsDict):ResultSubmission=>{
        if(users == undefined) users = {} 
        var user = users[this.userID]
        if(!user) user = UnknownUser
        return {isFirst:isFirst, addedPoint:this.addedPoint, solHash:this.solHash ,id:this.id, length: this.hands.length, hands:this.hands, user:user, optimal:this.optimal, timeStamp:this.timeStamp}
    }
}

export class FinishProblemMessage implements ServerMessage {
    type:MessageType = SFinishProblem
    subs!:ServerResultSubmissionDto[]

    constructor(init: FinishProblemMessage) {
        Object.assign(this, init);
        for(var i = 0; init.subs.length > i; i++)
            this.subs[i] = new ServerResultSubmissionDto(init.subs[i])
    }
    
    handle(dispatch : Dispatch<any>){
        dispatch(finishProblemFromServer(this.subs))
    }
}
