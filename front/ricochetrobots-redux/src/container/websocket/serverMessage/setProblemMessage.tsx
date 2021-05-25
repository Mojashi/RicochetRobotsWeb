import { Dispatch } from "redux"
import { Problem } from "../../../model/game/Problem"
import { setProblem } from "../../GameSlice"
import { MessageType, ServerMessage, SSetProblem } from "../WebsocketEventHandler"



export class SetProblemMessage implements ServerMessage {
	type:MessageType = SSetProblem
	problem! : Problem

	constructor(init: SetProblemMessage) {
		Object.assign(this, init)
	}
	handle(dispatch : Dispatch<any>){
		dispatch(setProblem(this.problem))
	}
}
