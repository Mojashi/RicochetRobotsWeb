
import { CJoin, ClientMessage,  MessageType } from "../WebsocketEventHandler"

export class JoinMessage implements ClientMessage {
	type:MessageType = CJoin
	password : string
	constructor(password? : string){
		this.password = password ? password : ""
	}

	toJSON(){
		return {
			type:this.type,
			password : this.password
		}
	}
}