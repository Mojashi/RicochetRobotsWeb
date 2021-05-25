import { Dispatch } from "redux"

import { notify } from "../../GameSlice"
import { MessageType, ServerMessage,  SNotify } from "../WebsocketEventHandler"




export class NotifyMessage implements ServerMessage {
	type:MessageType = SNotify
	msg! : string
	duration! : number

	constructor(init: NotifyMessage) {
		Object.assign(this, init)
	}
	handle(dispatch : Dispatch<any>){
		dispatch(notify({msg : this.msg, duration:this.duration}))
	}
}
