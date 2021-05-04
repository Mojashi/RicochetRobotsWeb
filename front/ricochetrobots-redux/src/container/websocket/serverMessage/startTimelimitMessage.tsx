import { Dispatch } from "redux"
import { setTimeleft } from "../../GameSlice"
import { MessageType, SStartTimelimit } from "../WebsocketEventHandler"

export class StartTimelimitMessage {
    type : MessageType = SStartTimelimit
    timeLeft! : number
    constructor(init: StartTimelimitMessage) {
        Object.assign(this, init)
    }
    handle(dispatch : Dispatch<any>){
        const f = (nex : Function, left:number) => {
            dispatch(setTimeleft(left))
            if(left > 0)
                setTimeout(nex, 1000, nex, left - 1)
        }
        f(f,this.timeLeft)
    }
}