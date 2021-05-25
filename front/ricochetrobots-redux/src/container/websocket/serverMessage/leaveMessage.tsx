import { Dispatch } from "redux"
import {  UserID } from "../../../model/User"
import { leaveFromRoom } from "../../GameSlice"
import { MessageType, ServerMessage,  SLeave } from "../WebsocketEventHandler"




export class LeaveMessage implements ServerMessage {
	type:MessageType = SLeave
	userID! : UserID

	constructor(init: LeaveMessage) {
		Object.assign(this, init)
	}
	handle(dispatch : Dispatch<any>){
		dispatch(leaveFromRoom(this.userID))
	}
}
