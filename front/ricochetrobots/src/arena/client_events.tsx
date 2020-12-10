import {Hand} from "../game/hand"

export interface ClientEvent {
    submit: SubmitCEvent | undefined
}

export interface SubmitCEvent {
    hands: Hand[]
}