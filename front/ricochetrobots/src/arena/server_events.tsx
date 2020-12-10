import {Hand} from "../game/hand"
import { BoardModel } from '../game/board'


export interface ServerEvent {
    start: StartSEvent | undefined
    submit: SubmitSEvent | undefined
    finish: FinishSEvent | undefined
    join: JoinSEvent | undefined
    leave: LeaveSEvent | undefined
}

export interface StartSEvent {
    board:      BoardModel
    finishdate: Date
}

export interface FinishSEvent {
    winner: string
    hands:  Hand[]
}

export interface SubmitSEvent  {
    hands: Hand[]
}

export interface JoinSEvent{
    name: string
}

export interface LeaveSEvent{
    name: string
}
