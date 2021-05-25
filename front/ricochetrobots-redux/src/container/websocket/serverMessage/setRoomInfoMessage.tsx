import { Dispatch } from "redux"
import { MessageType, SSetRoomInfo } from "../WebsocketEventHandler"
import {setRoomInfo} from "../../GameSlice"
import { RoomInfo } from "../../../model/RoomInfo"
export class SyncRoomMessage {
	type : MessageType = SSetRoomInfo
	roomInfo! : RoomInfo
	constructor(init: SyncRoomMessage) {
		Object.assign(this, init)
	}
	handle(dispatch : Dispatch<any>){
		dispatch(setRoomInfo(this.roomInfo))
	}
}