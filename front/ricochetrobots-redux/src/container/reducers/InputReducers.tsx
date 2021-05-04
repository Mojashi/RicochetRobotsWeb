import { Action, PayloadAction } from "@reduxjs/toolkit"
import { Hand } from "../../model/game/Hand"
import {produce} from "immer"
import { moveRobot } from "../../model/game/board/Board"
import {RoomState} from "../GameSlice"

export const InputReducers = {
    addHand: (state:RoomState, action : PayloadAction<Hand>) => (
        produce(state, draft=>{
            const {problemState, inputState} = draft
            if(problemState){
                const poss = inputState.robotPosHistory[inputState.robotPosHistory.length - 1].slice()
                const changed = 
                    moveRobot(problemState.problem.board, poss, action.payload.robot, action.payload.dir)
                if(changed){
                    inputState.hands.push(action.payload)
                    inputState.robotPosHistory.push(poss)
                }
            }
        })
    ),
    removeHand: (state:RoomState, action : Action) => (
        produce(state, draft=>{
            draft.inputState.hands.pop()
            if(draft.inputState.robotPosHistory.length > 1)
                draft.inputState.robotPosHistory.pop()
        })
    ),
    resetHand: (state:RoomState, action : Action) =>  (
        produce(state, draft=>{
            draft.inputState.hands=[]
            if(draft.problemState)
                draft.inputState.robotPosHistory = [draft.problemState.problem.robotPoss]
        })
    ),
    selectRobot: (state:RoomState, action:PayloadAction<{id:number, selected:boolean}>) => (
        produce(state, draft => {
            if(draft.inputState.selectedRobot.length > action.payload.id)
                draft.inputState.selectedRobot[action.payload.id] = action.payload.selected
        })
    )
}