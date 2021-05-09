import { Action, PayloadAction } from "@reduxjs/toolkit"
import { Hand } from "../../model/game/Hand"
import {current, Draft, produce} from "immer"
import { moveRobot } from "../../model/game/board/Board"
import {animStart, State, selectGame, selectRoomState} from "../GameSlice"
import { Problem } from "../../model/game/Problem"
import { OptSubSample, ResultSubmission, Submission, SubSample } from "../../model/game/Submission"
import Game from "../../model/game/Game"
import { UnknownUser, User, UserExample, UserID } from "../../model/User"
import { initBoardView } from "./BoardViewReducers"
import { animStartFunc, initResultState, resetRobots } from "./ResultReducers"
import { WritableDraft } from "immer/dist/internal"
import { Room } from "../../model/Room"
import { Hands } from "../../model/game/Hands"

export const setProblemFunc = (draft : Draft<State>, problem : Problem)=> {
    if(draft.gameState) {
        draft.problemState = {
            problem: problem,
            submissions : [],
            mySubmissions : [],
        }
        if(draft.resultState === undefined){
            startProblemFunc(draft)
        }
    }
}
export const setShortestFunc = (draft : Draft<State>, sub : Submission)=> {
    if(draft.problemState)
        draft.problemState.shortest = sub
}
export const addSubmissionFunc = (draft : Draft<State>, sub : Submission)=> {
    draft.problemState?.submissions.push(sub)
}
export const setPointFunc = (draft : Draft<State>, userID : UserID, point : number)=> {
    const game = selectGame(draft)
    if(game){
        game.points[userID] = point
        if(!selectRoomState(draft).participants.hasOwnProperty(userID)){
            selectRoomState(draft).participants[userID] = UnknownUser
        }
    }
}

export function finishProblemFunc(draft : Draft<State>, subs : ResultSubmission[]) {
    if(draft.problemState){
        initResultState(draft, draft.problemState.problem, subs)
        animStartFunc(draft, subs[0])
        draft.problemState = undefined
    }
}

export function startProblemFunc(draft : WritableDraft<State>) {
    if(draft.problemState){
        draft.resultState = undefined
        initBoardView(draft, draft.problemState.problem)
    }
}
export function joinToGameFunc(draft : WritableDraft<State>, user : User) {
    if(selectG){
        if(!draft.gameState.points.hasOwnProperty(user.id))
            draft.gameState.points[user.id] = 0
    }
}

export const GameReducers = {
    setProblem: (state:State, action : PayloadAction<Problem>) => (
        produce(state, draft => setProblemFunc(draft, action.payload))
    ),
    addSubmission: (state:State, action : PayloadAction<Submission>) => (
        produce(state, draft => addSubmissionFunc(draft, action.payload))
    ),
    setShortest: (state:State, action : PayloadAction<Submission>) => (
        produce(state, draft => setShortestFunc(draft, action.payload))
    ),
    setPoint: (state: State, action : PayloadAction<{userID:UserID, point:number}>) => (
        produce(state, draft => setPointFunc(draft, action.payload.userID, action.payload.point))
    ),
    setTimeleft: (state : State, action : PayloadAction<number>) => (
        produce(state, draft => {
            if(draft.problemState)
                draft.problemState.timeleft = action.payload
        })
    ),
    finishGame: (state : State, action : Action) => (
        produce(state, draft => {
            draft.problemState = undefined
            draft.gameState = undefined
        })
    ),
    finishProblem: (state : State, action : PayloadAction<ResultSubmission[]>) => (
        produce(state, draft => finishProblemFunc(draft, action.payload))
    ),
    startGame: (state : State, action : PayloadAction<number>) => (
        produce(state, draft => {
            if (draft.gameState === undefined || draft.gameState?.gameID !== action.payload) {
                draft.gameState = {
                    gameID : action.payload,
                    points : {},
                }
                draft.resultState = undefined
            }
        })
    ),
    addMySubmission : (state : State, action : PayloadAction<Hands>) => (
        produce(state, draft => {
            draft.problemState?.mySubmissions.push({
                hands : action.payload,
                timeStamp : Date.now(),
            })
        })
    )
}