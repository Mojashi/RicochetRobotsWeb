// stateの情報をからめて更新したいときに作る、serverMessagesと一対一ではない。（してもいいけど、必要になるたびで十分な気がする）

import { Action, PayloadAction } from "@reduxjs/toolkit"
import { Hand } from "../../model/game/Hand"
import {produce} from "immer"
import { moveRobot } from "../../model/game/board/Board"
import {RoomState} from "../GameSlice"
import { Problem } from "../../model/game/Problem"
import { OptSubSample, ResultSubmission, SolutionHash, Submission } from "../../model/game/Submission"
import { ServerSubmissionDto } from "../websocket/serverMessage/addSubmissionMessage"
import { ServerResultSubmissionDto } from "../websocket/serverMessage/finishProblemMessage"
import { addSubmissionFunc, finishProblemFunc, setShortestFunc } from "./GameReducers"
import { ServerHiddenSubmissionDto } from "../websocket/serverMessage/addHiddenSubmissionMessage"
import { UserExample, UserID } from "../../model/User"

export const ServerEventReducers = {
    addSubmissionFromServer: (state:RoomState, action : PayloadAction<ServerSubmissionDto>) => (
        produce(state, draft => addSubmissionFunc(draft, action.payload.toSubmission(state.participants)))
    ),
    addHiddenSubmissionFromServer: (state:RoomState, action : PayloadAction<ServerHiddenSubmissionDto>) => (
        produce(state, draft => addSubmissionFunc(draft, action.payload.toSubmission(state.participants)))
    ),
    setShortestFromServer: (state:RoomState, action : PayloadAction<ServerHiddenSubmissionDto>) => (
        produce(state, draft => setShortestFunc(draft, action.payload.toSubmission(state.participants)))
    ),
    finishProblemFromServer : (state:RoomState,action : PayloadAction<ServerResultSubmissionDto[]>) => (
        produce(state,draft => {
            const subs : ResultSubmission[] = []
            const al = new Set<SolutionHash>()
            action.payload.forEach(sub => {
                subs.push(sub.toSubmission(!al.has(sub.solHash), state.participants))
                al.add(sub.solHash)
            })
            
            finishProblemFunc(draft, subs)
        })
    )
}