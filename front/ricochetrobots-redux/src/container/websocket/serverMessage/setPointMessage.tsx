import { Dispatch } from "redux"
import { UserID } from "../../../model/User"
import { setPoint } from "../../GameSlice"
import { MessageType, ServerMessage, SSetPoint } from "../WebsocketEventHandler"




export class SetPointMessage implements ServerMessage {
	type:MessageType = SSetPoint
	userID! : UserID
	point! : number

	constructor(init: SetPointMessage) {
		Object.assign(this, init)
	}

	handle(dispatch : Dispatch<any>){
		dispatch(setPoint({userID:this.userID, point:this.point}))
	}
}
