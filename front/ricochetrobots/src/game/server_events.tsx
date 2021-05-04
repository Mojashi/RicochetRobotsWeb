import { Hand } from "./hand"
import { BoardModel } from './board'
import User from "../shared/user"
import { SubmissionModel } from "../shared/submission"
import {Game} from "./game"

export interface ServerEvent {
    start: StartSEvent | undefined
    submit: SubmitSEvent | undefined
    finish: FinishSEvent | undefined
    join: JoinSEvent | undefined
    leave: LeaveSEvent | undefined
    timelimit: TimeLimitSEvent | undefined
    showsub: ShowSubmissionSEvent | undefined
}

export interface ShowSubmissionSEvent {
    sub: SubmissionModel
}

export interface TimeLimitSEvent {
    game_id:number,
    rem_time:number
}

export interface StartSEvent {
    game: Game
    subs: SubmissionModel[]
}

export interface FinishSEvent {
    game_id: number,
    interval: number | undefined,
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
