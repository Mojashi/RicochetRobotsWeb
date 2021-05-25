import { Dispatch } from "redux"
import { Hands } from "../../../model/game/Hands"

import { Submission } from "../../../model/game/Submission"
import {  UnknownUser, UserID } from "../../../model/User"
import { addSubmissionFromServer, ParticipantsDict } from "../../GameSlice"
import { MessageType, SAddSubmission, ServerMessage } from "../WebsocketEventHandler"

export class ServerSubmissionDto {
	id! : number
	userID! : UserID
	hands! : Hands
	optimal! : boolean
	timeStamp!:number
	constructor(init: ServerSubmissionDto) {
		Object.assign(this, init)
	}
	toSubmission = (users? : ParticipantsDict):Submission=>{
		if(users === undefined) users = {} 
		let user = users[this.userID]
		if(!user) user = UnknownUser
		return {id:this.id, length: this.hands.length, hands:this.hands, user:user, optimal:this.optimal, timeStamp:this.timeStamp}
	}
}

export class AddSubmissionMessage implements ServerMessage {
	type: MessageType = SAddSubmission
	sub!: ServerSubmissionDto

	constructor(init: AddSubmissionMessage) {
		Object.assign(this, init)
	}
	handle(dispatch : Dispatch<any>){
		dispatch(addSubmissionFromServer(this.sub))
	}
}
