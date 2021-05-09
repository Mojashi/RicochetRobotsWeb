import { Action, createDraftSafeSelector, PayloadAction } from "@reduxjs/toolkit"
import { Hand } from "../../model/game/Hand"
import {produce} from "immer"
import { moveRobot } from "../../model/game/board/Board"
import {animStart, animStop, RoomState} from "../GameSlice"
import { ResultSubmission } from "../../model/game/Submission"
import { WritableDraft } from "immer/dist/internal"
import { addHandFunc, initBoardView, resetHandFunc } from "./BoardViewReducers"
import { Problem } from "../../model/game/Problem"
import { startProblemFunc } from "./GameReducers"

export function initResultState(draft : WritableDraft<RoomState>, problem : Problem, subs : ResultSubmission[]) {
    draft.resultState = {
        submissions : subs,
        problem : problem,
        animID : 0,
    }
    if(draft.boardViewState.robotPosHistory.length > 1)
        resetRobots(draft)
    initBoardView(draft, problem)
}

export function animStopFunc(draft : WritableDraft<RoomState>) {
    if(draft.resultState) {
        resetHandFunc(draft)
        draft.resultState.animFrame = undefined
        draft.resultState.animSub = undefined
    }
}
export function resetRobots(draft : WritableDraft<RoomState>){
    if(draft.resultState) {
        draft.resultState.animFrame = -1
        resetHandFunc(draft)
    }
}
function hasResetRobot(draft : WritableDraft<RoomState>) : boolean {
    if(draft.resultState){
        return draft.resultState.animFrame === -1
    }
    return false
}

export function animStartFunc(draft : WritableDraft<RoomState>, sub : ResultSubmission) {
    if(draft.resultState) {
        draft.resultState.animID += 1
        draft.resultState.animSub = sub

        if(draft.boardViewState.robotPosHistory.length > 1) { //最初にリセットが必要
            resetRobots(draft);
        } else if(!hasResetRobot(draft)){ //リセット中ならそのまま
            draft.resultState.animFrame = 0
            addHandFunc(draft, sub.hands[0])
        }
        
    }
}

export const ResultReducers = {
    finishResult: (state:RoomState, action : Action) => (
        produce(state,draft => {
            if(draft.gameState){ //まだゲーム続いてる
                draft.resultState = undefined
                if(draft.problemState) {
                    startProblemFunc(draft);
                }
            } else { //もうゲームおわり
                draft.resultState = undefined
                initBoardView(draft, undefined)
            }
        })
    ),
    animNext: (state:RoomState, action : PayloadAction<number>) => (
        produce(state, draft=>{
            const sub = draft.resultState?.animSub
            if(sub !== undefined && 
                draft.resultState?.animFrame !== undefined && 
                action.payload === draft.resultState.animID){
                if(hasResetRobot(draft)){
                    draft.resultState.animID += 1
                } 

                draft.resultState.animFrame += 1
                const frame = draft.resultState.animFrame
                if(frame >= sub.hands.length) {
                    resetRobots(draft);
                } else {
                    addHandFunc(draft, sub.hands[frame])
                }
            }
        })
    ),
    animStart: (state: RoomState, action : PayloadAction<ResultSubmission>) => (
        produce(state,draft=> animStartFunc(draft, action.payload))
    ),
    animStop: (state: RoomState, action : Action) => (
        produce(state,draft=> animStopFunc(draft))
    ),
}