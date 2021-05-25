
import { ClientMessage, CNextProblem,   MessageType } from "../WebsocketEventHandler"

export class NextProblemRequestMessage implements ClientMessage {
	type:MessageType = CNextProblem
	toJSON(){
		return {
			type:this.type,
		}
	}
}