
import { ClientMessage, CRequestHint,   MessageType } from "../WebsocketEventHandler"

export class RequestHintMessage implements ClientMessage {
	type:MessageType = CRequestHint
	toJSON(){
		return {
			type:this.type,
		}
	}
}