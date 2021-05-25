import { Dispatch } from "redux"

import { Submission } from "../../../model/game/Submission"
import {  UnknownUser, UserID } from "../../../model/User"
import { addHiddenSubmissionFromServer, ParticipantsDict } from "../../GameSlice"
import { MessageType, SAddHiddenSubmission,  ServerMessage } from "../WebsocketEventHandler"

export class ServerHiddenSubmissionDto {
	id! : number
	length! : number
	userID! : UserID
	optimal! : boolean
	timeStamp!:number
	constructor(init: ServerHiddenSubmissionDto) {
		Object.assign(this, init)
	}
	toSubmission = (users? : ParticipantsDict):Submission=>{
		if(users === undefined) users = {}
		let user = users[this.userID]
		if(!user) user = UnknownUser
		return {id:this.id, length:this.length, user:user, optimal:this.optimal, timeStamp:this.timeStamp}
	}
}

export class AddHiddenSubmissionMessage implements ServerMessage {
	type: MessageType = SAddHiddenSubmission
	sub!: ServerHiddenSubmissionDto

	constructor(init: AddHiddenSubmissionMessage) {
		Object.assign(this, init)
		this.sub = new ServerHiddenSubmissionDto(this.sub)
	}

	handle(dispatch : Dispatch<any>){
		dispatch(addHiddenSubmissionFromServer(this.sub))
	}
}
