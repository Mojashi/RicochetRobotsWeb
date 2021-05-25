import { Dispatch } from "redux"

import { failedToAuth } from "../../GameSlice"
import { MessageType, ServerMessage,	SUnauth } from "../WebsocketEventHandler"



export class UnauthErrorMessage implements ServerMessage {
	type:MessageType = SUnauth

	constructor(init: UnauthErrorMessage) {
		Object.assign(this, init)
	}
	handle(dispatch : Dispatch<any>){
		dispatch(failedToAuth())
	}
}
