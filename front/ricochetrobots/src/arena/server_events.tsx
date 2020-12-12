import {Hand} from "../game/hand"
import { BoardModel } from '../game/board'
import {Game} from '../game/game'
import User from "../shared/user"
import {SubmissionModel} from "../shared/subrank"

export interface ServerEvent {
    start: StartSEvent | undefined
    submit: SubmitSEvent | undefined
    finish: FinishSEvent | undefined
    join: JoinSEvent | undefined
    leave: LeaveSEvent | undefined
}

export interface StartSEvent {
    game:      Game
    subs:   SubmissionModel[]
    finishdate: Date
}

export interface FinishSEvent {
    winner: User
    hands:  Hand[]
}

export interface SubmitSEvent  {
    sub: SubmissionModel
}

export interface JoinSEvent{
    user: User
}

export interface LeaveSEvent{
    user: User
}
