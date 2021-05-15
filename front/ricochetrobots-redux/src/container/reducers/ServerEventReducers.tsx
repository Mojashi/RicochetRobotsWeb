// stateの情報をからめて更新したいときに作る、serverMessagesと一対一ではない。（してもいいけど、必要になるたびで十分な気がする）

import { Action, PayloadAction } from "@reduxjs/toolkit"
import { Hand } from "../../model/game/Hand"
import {produce} from "immer"
import { moveRobot } from "../../model/game/board/Board"
import {getRoomState, State} from "../GameSlice"
import { Problem } from "../../model/game/Problem"
import { OptSubSample, ResultSubmission, SolutionHash, Submission } from "../../model/game/Submission"
import { ServerSubmissionDto } from "../websocket/serverMessage/addSubmissionMessage"
import { ServerResultSubmissionDto } from "../websocket/serverMessage/finishProblemMessage"
import { addSubmissionFunc, finishProblemFunc, setShortestFunc } from "./GameReducers"
import { ServerHiddenSubmissionDto } from "../websocket/serverMessage/addHiddenSubmissionMessage"
import { UserExample, UserID } from "../../model/User"

export const ServerEventReducers = {
    addSubmissionFromServer: (state:State, action : PayloadAction<ServerSubmissionDto>) => (
        produce(state, draft => addSubmissionFunc(getRoomState(draft), action.payload.toSubmission(getRoomState(draft).participants)))
    ),
    addHiddenSubmissionFromServer: (state:State, action : PayloadAction<ServerHiddenSubmissionDto>) => (
        produce(state, draft => addSubmissionFunc(getRoomState(draft), action.payload.toSubmission(getRoomState(draft).participants)))
    ),
    setShortestFromServer: (state:State, action : PayloadAction<ServerHiddenSubmissionDto>) => (
        produce(state, draft => setShortestFunc(getRoomState(draft), action.payload.toSubmission(getRoomState(draft).participants)))
    ),
    finishProblemFromServer : (state:State,action : PayloadAction<ServerResultSubmissionDto[]>) => (
        produce(state,draft => {
            const room = getRoomState(draft)
            const subs : ResultSubmission[] = []
            const al = new Set<SolutionHash>()
            action.payload.forEach(sub => {
                subs.push(sub.toSubmission(!al.has(sub.solHash), room.participants))
                al.add(sub.solHash)
            })
            
            finishProblemFunc(room, subs)
        })
    )
}