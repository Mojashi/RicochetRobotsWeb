import { Dispatch } from "redux"
import { finishGame } from "../../GameSlice"
import { MessageType, ServerMessage, SFinishGame } from "../WebsocketEventHandler"





export class FinishGameMessage implements ServerMessage {
	type:MessageType = SFinishGame

	constructor(init: FinishGameMessage) {
		Object.assign(this, init)
	}
	handle(dispatch : Dispatch<any>){
		dispatch(finishGame())
	}
}
