import {   PayloadAction } from "@reduxjs/toolkit"

import {Draft, produce} from "immer"

import {	getRoomState, RoomState, State} from "../GameSlice"
import { ResultSubmission } from "../../model/game/Submission"
import {  initBoardView } from "./BoardViewReducers"
import { Problem } from "../../model/game/Problem"
import {  startProblemFunc } from "./GameReducers"
import { animStartFunc, animStopFunc, getBoardViewControll, releaseBoardViewControll } from "./AnimReducers"

export function initResultState(draft : Draft<RoomState>, problem : Problem, subs : ResultSubmission[]) {
	draft.problemResultState = {
		submissions : subs,
		problem : problem,
		readyNext: false,
	}
	initBoardView(draft, problem)
	if (subs.length > 0){
		playResultSubFunc(draft, subs[0])
	}
}

export function finishResultFunc(draft : Draft<RoomState>) {
	stopResultSubFunc(draft)
	if(draft.gameState){ //まだゲーム続いてる
		draft.problemResultState = undefined
		if(draft.problemState) {
			startProblemFunc(draft)
		}
	} else { //もうゲームおわり
		draft.problemResultState = undefined
		initBoardView(draft, undefined)
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

export function playResultSubFunc(draft : Draft<RoomState>, sub : ResultSubmission) {
	if(draft.problemResultState){
		draft.problemResultState.animSub = sub
		getBoardViewControll(draft, "presult")
		animStartFunc(draft, sub.hands)
	}
}
export function stopResultSubFunc(draft : Draft<RoomState>) {
	if(draft.problemResultState){
		draft.problemResultState.animSub = undefined
		if(releaseBoardViewControll(draft, "presult")){
			animStopFunc(draft)
		}
	}
}

export const ResultReducers = {
	finishResult: (state:State ) => (
		produce(state,draft => finishResultFunc(getRoomState(draft)))
	),
	setReadyNext : (state : State, action : PayloadAction<boolean>) => (
		produce(state, draft=> readyNextFunc(getRoomState(draft), action.payload))
	),
	playResultSub :  (state : State, action : PayloadAction<ResultSubmission>) => (
		produce(state, draft=> playResultSubFunc(getRoomState(draft), action.payload))
	),
	stopResultSub :  (state : State ) => (
		produce(state, draft=> stopResultSubFunc(getRoomState(draft)))
	),
}