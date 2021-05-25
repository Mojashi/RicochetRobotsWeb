import { Dispatch } from "redux"
import { User } from "../../../model/User"
import { tellUser } from "../../GameSlice"
import { MessageType, ServerMessage,   STellUser } from "../WebsocketEventHandler"




export class TellUserMessage implements ServerMessage {
	type:MessageType = STellUser
	user! : User

	constructor(init: TellUserMessage) {
		Object.assign(this, init)
	}
	handle(dispatch : Dispatch<any>){
		dispatch(tellUser(this.user))
	}
}
