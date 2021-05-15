import { Action, createDraftSafeSelector, PayloadAction } from "@reduxjs/toolkit"
import { Hand } from "../../model/game/Hand"
import {Draft, produce} from "immer"
import { moveRobot } from "../../model/game/board/Board"
import {animNext, animStart, animStop, getProblemResultState, getRoomState, RoomState, State} from "../GameSlice"
import { ResultSubmission } from "../../model/game/Submission"
import { addHandFunc, initBoardView, resetHandFunc } from "./BoardViewReducers"
import { Problem } from "../../model/game/Problem"
import { finishProblemFunc, startProblemFunc } from "./GameReducers"

export function initResultState(draft : Draft<RoomState>, problem : Problem, subs : ResultSubmission[]) {
    draft.problemResultState = {
        submissions : subs,
        problem : problem,
        animID : 0,
        readyNext: false,
    }
    if(draft.boardViewState.robotPosHistory.length > 1)
        resetRobots(draft)
    initBoardView(draft, problem)
}

export function animStopFunc(draft : Draft<RoomState>) {
    if(draft.problemResultState) {
        resetHandFunc(draft)
        draft.problemResultState.animFrame = undefined
        draft.problemResultState.animSub = undefined
    }
}
export function resetRobots(draft : Draft<RoomState>){
    if(draft.problemResultState) {
        draft.problemResultState.animFrame = -1
        resetHandFunc(draft)
    }
}
function hasResetRobot(draft : Draft<RoomState>) : boolean {
    if(draft.problemResultState){
        return draft.problemResultState.animFrame === -1
    }
    return false
}

export function animStartFunc(draft : Draft<RoomState>, sub : ResultSubmission) {
    if(draft.problemResultState) {
        draft.problemResultState.animID += 1
        draft.problemResultState.animSub = sub

        if(draft.boardViewState.robotPosHistory.length > 1) { //最初にリセットが必要
            resetRobots(draft);
        } else if(!hasResetRobot(draft)){ //リセット中ならそのまま
            draft.problemResultState.animFrame = 0
            addHandFunc(draft, sub.hands[0])
        }
        
    }
}

export function finishResultFunc(draft : Draft<RoomState>) {
    if(draft.gameState){ //まだゲーム続いてる
        draft.problemResultState = undefined
        if(draft.problemState) {
            startProblemFunc(draft);
        }
    } else { //もうゲームおわり
        draft.problemResultState = undefined
        initBoardView(draft, undefined)
    }
}

export function animNextFunc(draft : Draft<RoomState>, animID : number) {
    const sub = draft.problemResultState?.animSub
    if(sub !== undefined && 
        draft.problemResultState?.animFrame !== undefined && 
        animID === draft.problemResultState.animID){
        if(hasResetRobot(draft)){
            draft.problemResultState.animID += 1
        } 

        draft.problemResultState.animFrame += 1
        const frame = draft.problemResultState.animFrame
        if(frame >= sub.hands.length) {
            resetRobots(draft);
        } else {
            addHandFunc(draft, sub.hands[frame])
        }
    }
}

export function readyNextFunc(draft : Draft<RoomState>, ready : boolean) {
    const result = draft.problemResultState
    if(result){
        result.readyNext = ready
        if(ready && draft.problemState !== undefined){
            finishResultFunc(draft)
        }
    }
}

export const ResultReducers = {
    finishResult: (state:State, action : Action) => (
        produce(state,draft => finishResultFunc(getRoomState(draft)))
    ),
    animNext: (state:State, action : PayloadAction<number>) => (
        produce(state, draft=>animNextFunc(getRoomState(draft), action.payload))
    ),
    animStart: (state: State, action : PayloadAction<ResultSubmission>) => (
        produce(state,draft=> animStartFunc(getRoomState(draft), action.payload))
    ),
    animStop: (state: State, action : Action) => (
        produce(state,draft=> animStopFunc(getRoomState(draft)))
    ),
    setReadyNext : (state : State, action : PayloadAction<boolean>) => (
        produce(state, draft=> readyNextFunc(getRoomState(draft), action.payload))
    )
}