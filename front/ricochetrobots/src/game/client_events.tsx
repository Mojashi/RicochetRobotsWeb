import {Hand} from "../game/hand"

export interface ClientEvent {
    submit: SubmitCEvent | undefined
}

export interface SubmitCEvent {
    game_id: number
    hands: Hand[]
}