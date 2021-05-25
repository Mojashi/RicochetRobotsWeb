import { Dispatch } from "redux"
import { Hands } from "../../../model/game/Hands"

import {  setHint } from "../../GameSlice"
import { MessageType, ServerMessage, SHint } from "../WebsocketEventHandler"




export class SetHintMessage implements ServerMessage {
	type:MessageType = SHint
	hands! : Hands

	constructor(init: SetHintMessage) {
		Object.assign(this, init)
	}
	handle(dispatch : Dispatch<any>){
		dispatch(setHint(this.hands))
	}
}
