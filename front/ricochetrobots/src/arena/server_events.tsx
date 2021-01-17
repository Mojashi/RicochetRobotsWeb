import { Hand } from "../game/hand"
import { BoardModel } from '../game/board'
import User from "../shared/user"
import { SubmissionModel } from "../shared/subrank"
import {Game} from "../game/game"

export interface ServerEvent {
    start: StartSEvent | undefined
    submit: SubmitSEvent | undefined
    finish: FinishSEvent | undefined
    join: JoinSEvent | undefined
    leave: LeaveSEvent | undefined
}

export interface StartSEvent {
    game: Game
    subs: SubmissionModel[]
}

export interface FinishSEvent {
    game_id: number
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
