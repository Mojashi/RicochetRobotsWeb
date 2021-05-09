import { Dispatch } from "redux"
import { notify, setTimeleft } from "../../GameSlice"
import { MessageType, SStartTimelimit } from "../WebsocketEventHandler"

export class StartTimelimitMessage {
    type : MessageType = SStartTimelimit
    timeLeft! : number
    constructor(init: StartTimelimitMessage) {
        Object.assign(this, init)
    }
    handle(dispatch : Dispatch<any>){
        const f = (nex : Function, left:number) => {
            if(left > 0)
                dispatch(notify(`${left}`))
            else
                dispatch(notify("FINISH"))
            if(left > 0)
                setTimeout(nex, 1000, nex, left - 1)
        }
        f(f,this.timeLeft)
    }
}