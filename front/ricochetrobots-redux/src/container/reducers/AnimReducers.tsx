import {   PayloadAction } from "@reduxjs/toolkit"

import {Draft, produce} from "immer"

import {   BoardViewController,   getRoomState, RoomState, State} from "../GameSlice"

import { addHandFunc,  resetHandFunc } from "./BoardViewReducers"

import {   stopHintFunc } from "./GameReducers"
import { Hands } from "../../model/game/Hands"
import { stopResultSubFunc } from "./ResultReducers"

export function animStopFunc(draft : Draft<RoomState>) {
	resetHandFunc(draft)
	draft.boardViewState.animState.hands = undefined
	draft.boardViewState.animState.frame = undefined
}
export function resetRobotsFunc(draft : Draft<RoomState>){
	const anim = draft.boardViewState.animState
	if(draft.boardViewState.robotPosHistory.length > 1){
		anim.frame = -1
		resetHandFunc(draft)
	}
}
function hasResetRobot(draft : Draft<RoomState>) : boolean {
	const anim = draft.boardViewState.animState
	if(anim.hands) {
		return anim.frame === -1
	}
	return false
}

export function animStartFunc(draft : Draft<RoomState>, hands : Hands) {
	const anim = draft.boardViewState.animState
	anim.id += 1
	anim.hands = hands
	if(draft.boardViewState.robotPosHistory.length > 1) { //最初にリセットが必要
		resetRobotsFunc(draft)
	} else if(!hasResetRobot(draft)){ //リセット中ならそのまま
		anim.frame = 0
		addHandFunc(draft, anim.hands[0])
	}

}

export function animNextFunc(draft : Draft<RoomState>, animID : number) {
	const anim = draft.boardViewState.animState
	if(anim.hands !== undefined && 
		anim.frame !== undefined && 
		animID === anim.id){
		if(hasResetRobot(draft)){
			anim.id += 1
		} 

		anim.frame += 1
		const frame =anim.frame
		if(frame >= anim.hands.length) {
			resetRobotsFunc(draft)
		} else {
			addHandFunc(draft, anim.hands[frame])
		}
	}
}

export function getBoardViewControll(draft : Draft<RoomState>, controller : BoardViewController){
	if(draft.boardViewState.animState.controller !== controller){
		switch (draft.boardViewState.animState.controller) {
		case "hint":
			stopHintFunc(draft)
			break
		case "presult":
			stopResultSubFunc(draft)
			break
		}
		draft.boardViewState.animState.controller = controller
	}
}

export function releaseBoardViewControll(draft : Draft<RoomState>, controller : BoardViewController) : boolean {
	if(draft.boardViewState.animState.controller === controller){
		draft.boardViewState.animState.controller = undefined
		return true
	}
	return false
}

export const AnimReducers = {
	animNext: (state:State, action : PayloadAction<number>) => (
		produce(state, draft=>animNextFunc(getRoomState(draft), action.payload))
	),
	animStart: (state: State, action : PayloadAction<Hands>) => (
		produce(state,draft=> animStartFunc(getRoomState(draft), action.payload))
	),
	animStop: (state: State ) => (
		produce(state,draft=> animStopFunc(getRoomState(draft)))
	),
}