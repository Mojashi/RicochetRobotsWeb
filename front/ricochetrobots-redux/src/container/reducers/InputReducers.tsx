import { Action, bindActionCreators, PayloadAction } from "@reduxjs/toolkit"
import { Hand } from "../../model/game/Hand"
import {produce} from "immer"
import { moveRobot } from "../../model/game/board/Board"
import {RoomState, selectRobot} from "../GameSlice"
import { WritableDraft } from "immer/dist/internal"
import { addHandFunc, removeHandFunc, resetHandFunc, selectRobotFunc } from "./BoardViewReducers"
import { Robot } from "../../model/game/Robot"

function inputAcceptable(draft : WritableDraft<RoomState>) {
    return draft.resultState === undefined && draft.problemState !== undefined
}

export const InputReducers = {
    addHandFromInput: (state:RoomState, action : PayloadAction<Hand>) => (
        produce(state, draft=>{
            if(inputAcceptable(draft)) 
                addHandFunc(draft, action.payload)
        })
    ),
    removeHandFromInput: (state:RoomState, action : Action) => (
        produce(state, draft=>{
            if(inputAcceptable(draft)) 
                removeHandFunc(draft)
        })
    ),
    resetHandFromInput: (state:RoomState, action : Action) =>  (
        produce(state, draft=>{
            if(inputAcceptable(draft)) 
                resetHandFunc(draft)
        })
    ),
    selectRobotFromInput: (state:RoomState, action:PayloadAction<{robot:Robot, selected:boolean}>) => (
        produce(state, draft => {
            if(inputAcceptable(draft))
                selectRobotFunc(draft, action.payload.robot, action.payload.selected)
        })
    )
}