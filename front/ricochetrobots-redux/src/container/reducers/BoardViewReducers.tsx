import { Action, PayloadAction } from "@reduxjs/toolkit"
import { Hand } from "../../model/game/Hand"
import {produce} from "immer"
import { moveRobot } from "../../model/game/board/Board"
import {getRoomState, RoomState, State} from "../GameSlice"
import { WritableDraft } from "immer/dist/internal"
import { Robot } from "../../model/game/Robot"
import { Problem } from "../../model/game/Problem"

export function addHandFunc(draft : WritableDraft<RoomState>, hand : Hand) {
    const {boardViewState} = draft
    var problem = draft.boardViewState?.problem

    if(problem){
        const poss = boardViewState.robotPosHistory[boardViewState.robotPosHistory.length - 1].slice()
        const changed = 
            moveRobot(problem.board, poss, hand.robot, hand.dir)
        if(changed){
            boardViewState.hands.push(hand)
            boardViewState.robotPosHistory.push(poss)
        }
    }
}

export function removeHandFunc(draft : WritableDraft<RoomState>) {
    if(draft.boardViewState.robotPosHistory.length > 1){
        draft.boardViewState.hands.pop()
        draft.boardViewState.robotPosHistory.pop()
    }
}

export function resetHandFunc(draft : WritableDraft<RoomState>) {
    draft.boardViewState.hands=[]
    if(draft.boardViewState.problem)
        draft.boardViewState.robotPosHistory = [draft.boardViewState.problem.robotPoss]
}

export function selectRobotFunc(draft : WritableDraft<RoomState>, robot:Robot, selected:boolean) {
    if(draft.boardViewState.selectedRobot.length > robot)
        draft.boardViewState.selectedRobot[robot] = selected
}

export function initBoardView(draft :WritableDraft<RoomState>, problem? : Problem) {
    if(problem) {
        draft.boardViewState = {
            problem : problem,
            hands : [],
            robotPosHistory : [problem.robotPoss],
            selectedRobot : Array.from({length:problem.numRobot},()=>false),
        }
    } else {
        draft.boardViewState = {
            problem : undefined,
            hands : [],
            robotPosHistory : [],
            selectedRobot : [],
        }
    }
}

export const BoardViewReducers = {
    addHand: (state:State, action : PayloadAction<Hand>) => (
        produce(state, draft=>addHandFunc(getRoomState(draft), action.payload))
    ),
    removeHand: (state:State, action : Action) => (
        produce(state, draft=>removeHandFunc(getRoomState(draft)))
    ),
    resetHand: (state:State, action : Action) =>  (
        produce(state, draft=>resetHandFunc(getRoomState(draft)))
    ),
    selectRobot: (state:State, action:PayloadAction<{robot : Robot, selected:boolean}>) => (
        produce(state, draft => selectRobotFunc(getRoomState(draft), action.payload.robot, action.payload.selected))
    ),
}