import { Hand } from "../game/hand"
import { BoardModel } from '../game/board'
import { Game } from '../game/game'
import User from "../shared/user"
import { SubmissionModel } from "../shared/subrank"

export interface ServerEvent {
    start: StartSEvent | undefined
    submit: SubmitSEvent | undefined
    finish: FinishSEvent | undefined
    join: JoinSEvent | undefined
    leave: LeaveSEvent | undefined
}

export interface StartSEvent {
    game_id: number
    game: Game
    subs: SubmissionModel[]
    finishdate: Date
}

export interface FinishSEvent {
    game_id: number
    sub: SubmissionModel
}

export interface SubmitSEvent {
    game_id: number
    sub: SubmissionModel
}

export interface JoinSEvent {
    user: User
}

export interface LeaveSEvent {
    user: User
}
