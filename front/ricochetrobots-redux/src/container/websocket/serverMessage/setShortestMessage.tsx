import { Dispatch } from "redux"
import { setShortestFromServer } from "../../GameSlice"
import { MessageType, ServerMessage, SSetShortest } from "../WebsocketEventHandler"
import { ServerHiddenSubmissionDto } from "./addHiddenSubmissionMessage"



export class SetShortestMessage implements ServerMessage {
	type:MessageType = SSetShortest
	sub!: ServerHiddenSubmissionDto

	constructor(init: SetShortestMessage) {
		Object.assign(this, init)
		this.sub = new ServerHiddenSubmissionDto(this.sub)
	}
	handle(dispatch : Dispatch<any>){
		dispatch(setShortestFromServer(this.sub))
	}
}
