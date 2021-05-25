import {  PayloadAction } from "@reduxjs/toolkit"
import { Hand } from "../../model/game/Hand"
import {produce} from "immer"
import Board from "../../model/game/board/Board"
import {getRoomState, initAnimState, RoomState, State} from "../GameSlice"
import {  WritableDraft } from "immer/dist/internal"
import { Robot } from "../../model/game/Robot"
import { Problem } from "../../model/game/Problem"

import { resetRobotsFunc } from "./AnimReducers"
import { Pos } from "../../model/game/Pos"
import { DoMirror } from "../../model/game/board/Cell"
import { Dir, dirToIdx, dirToVec, invDir } from "../../model/game/Dir"
import { AnimPath } from "../../component/room/game/SvgAnim"


function enc(pos : Pos, dir : Dir){
	return pos.x + pos.y * 16 + dir * 256
}


export function makeAnim(board : Board, robotPoss : Pos[], mainRobot : Robot, dir : Dir) : [boolean, AnimPath]{
	let changed = false
	const al = new Set()
	const anim = []
	let path = [robotPoss[mainRobot]]

	al.add(enc(robotPoss[mainRobot], dir))
	while(true){
		const vec = dirToVec(dir)
		const bnext = {x:robotPoss[mainRobot].x + vec.x, y:robotPoss[mainRobot].y + vec.y}
		const next = {x:(bnext.x + board.width) % board.width, y:(bnext.y + board.height) % board.height}
		if(board.cells[robotPoss[mainRobot].y][robotPoss[mainRobot].x].walls[dirToIdx(dir)]) break
		if(robotPoss.some(p=>(p.x === next.x && p.y === next.y))) break

		if(al.has(enc(next, dir))) {
			return [false, []]
		}
		if(bnext.x >= board.width || bnext.x < 0 || bnext.y >= board.height || bnext.y < 0) {
			path.push(bnext)
			anim.push(path.slice())

			const vec = dirToVec(invDir(dir))
			const fnext = {x:next.x + vec.x, y:next.y + vec.y}
			path = [fnext]
		}

		const m = board.cells[next.y][next.x].mirror
		if(m && m?.trans !== mainRobot){
			dir = DoMirror(dir, m)
			path.push(next)
		}

		al.add(robotPoss[mainRobot])
		robotPoss[mainRobot] = next
		changed = true
	}
	path.push(robotPoss[mainRobot])
	anim.push(path)
	return [changed, anim]
}
export function reverseAnim(anim : AnimPath) : AnimPath {
	return anim.reverse().map(p=>p.reverse())
}

export function addHandFunc(draft : WritableDraft<RoomState>, hand : Hand) {
	const {boardViewState} = draft
	const problem = draft.boardViewState?.problem

	if(problem){

		const poss = boardViewState.robotPosHistory[boardViewState.robotPosHistory.length - 1].slice()
		const [changed,animPath] = 
			makeAnim(problem.board, poss, hand.robot, hand.dir)
		if(changed){
			boardViewState.hands.push(hand)
			boardViewState.robotPosHistory.push(poss)
			boardViewState.animPaths[hand.robot] = animPath
		}
	}
}

export function removeHandFunc(draft : WritableDraft<RoomState>) {
	const {boardViewState} = draft
	const problem = draft.boardViewState?.problem
	if(boardViewState.robotPosHistory.length > 1){
		const hand = boardViewState.hands.pop()
		boardViewState.robotPosHistory.pop()
		const poss = boardViewState.robotPosHistory[boardViewState.robotPosHistory.length - 1].slice()
		if(hand && problem){
			const [, animPath] = makeAnim(problem.board, poss, hand.robot, hand.dir)
			boardViewState.animPaths[hand.robot] = reverseAnim(animPath)
		}
	}
}

export function resetHandFunc(draft : WritableDraft<RoomState>) {
	draft.boardViewState.hands=[]
	if(draft.boardViewState.problem){
		draft.boardViewState.robotPosHistory = [draft.boardViewState.problem.robotPoss]
		
		draft.boardViewState.animPaths = draft.boardViewState.problem.robotPoss.map(p=>[[p]])
	}
}

export function selectRobotFunc(draft : WritableDraft<RoomState>, robot:Robot, selected:boolean) {
	if(draft.boardViewState.selectedRobot.length > robot)
		draft.boardViewState.selectedRobot[robot] = selected
}

export function initBoardView(draft :WritableDraft<RoomState>, problem? : Problem) {
	if(problem) {
		resetRobotsFunc(draft)
		draft.boardViewState = {
			problem : problem,
			hands : [],
			robotPosHistory : [problem.robotPoss],
			animPaths : problem.robotPoss.map(p=>[[p]]),
			selectedRobot : Array.from({length:problem.numRobot},()=>false),
			animState:draft.boardViewState.animState,
		}
	} else {
		resetRobotsFunc(draft)
		draft.boardViewState = {
			problem : undefined,
			hands : [],
			robotPosHistory : [],
			animPaths:[],
			selectedRobot : [],
			animState:initAnimState,
		}
	}
}

export function getViewControllFunc(){
	
}

export const BoardViewReducers = {
	addHand: (state:State, action : PayloadAction<Hand>) => (
		produce(state, draft=>addHandFunc(getRoomState(draft), action.payload))
	),
	removeHand: (state:State ) => (
		produce(state, draft=>removeHandFunc(getRoomState(draft)))
	),
	resetHand: (state:State ) =>  (
		produce(state, draft=>resetHandFunc(getRoomState(draft)))
	),
	selectRobot: (state:State, action:PayloadAction<{robot : Robot, selected:boolean}>) => (
		produce(state, draft => selectRobotFunc(getRoomState(draft), action.payload.robot, action.payload.selected))
	),
}
