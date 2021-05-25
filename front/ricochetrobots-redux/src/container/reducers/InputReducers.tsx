import {   PayloadAction } from "@reduxjs/toolkit"
import { Hand } from "../../model/game/Hand"
import {produce} from "immer"

import { getRoomState, RoomState,  State} from "../GameSlice"
import { WritableDraft } from "immer/dist/internal"
import { addHandFunc, removeHandFunc, resetHandFunc, selectRobotFunc } from "./BoardViewReducers"
import { Robot } from "../../model/game/Robot"
import { animStopFunc, getBoardViewControll } from "./AnimReducers"

function inputAcceptable(draft : WritableDraft<RoomState>) {
	if(draft.problemResultState === undefined && draft.problemState !== undefined){
		if(draft.boardViewState.animState.hands){
			getBoardViewControll(draft, "input")
			animStopFunc(draft)
		}
		return true
	}
	return false
}

export const InputReducers = {
	addHandFromInput: (state:State, action : PayloadAction<Hand>) => (
		produce(state, draft=>{
			if(inputAcceptable(getRoomState(draft))) {
				addHandFunc(getRoomState(draft), action.payload)
			}
		})
	),
	removeHandFromInput: (state:State ) => (
		produce(state, draft=>{
			if(inputAcceptable(getRoomState(draft))) {
				removeHandFunc(getRoomState(draft))
			}
		})
	),
	resetHandFromInput: (state:State ) =>  (
		produce(state, draft=>{
			if(inputAcceptable(getRoomState(draft))) {
				resetHandFunc(getRoomState(draft))
			}
		})
	),
	selectRobotFromInput: (state:State, action:PayloadAction<{robot:Robot, selected:boolean}>) => (
		produce(state, draft => {
			if(inputAcceptable(getRoomState(draft))){
				selectRobotFunc(getRoomState(draft), action.payload.robot, action.payload.selected)
			}
		})
	)
}