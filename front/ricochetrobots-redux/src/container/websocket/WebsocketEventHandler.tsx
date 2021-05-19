import { Action, Dispatch } from "redux";
import { produce } from "immer"
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetShortestMessage } from "./serverMessage/setShortestMessage";
import { AddHiddenSubmissionMessage } from "./serverMessage/addHiddenSubmissionMessage";
import { AddSubmissionMessage } from "./serverMessage/addSubmissionMessage";
import { SetProblemMessage } from "./serverMessage/setProblemMessage";
import { SetPointMessage } from "./serverMessage/setPointMessage";
import { JoinMessage } from "./serverMessage/joinMessage";
import { LeaveMessage } from "./serverMessage/leaveMessage";
import { StartTimelimitMessage } from "./serverMessage/startTimelimitMessage";
import { FinishGameMessage } from "./serverMessage/finishGameMessage";
import { FinishProblemMessage } from "./serverMessage/finishProblemMessage";
import { StartGameMessage } from "./serverMessage/startGameMessage";
import { SyncRoomMessage } from "./serverMessage/setRoomInfoMessage";
import { NotifyMessage} from "./serverMessage/notifyMessage";
import { notify,quitRoom } from "../GameSlice";
import { TellUserMessage } from "./serverMessage/tellUserMessage";
import { UnauthErrorMessage } from "./serverMessage/unauthErrorMessage";
import { SetHintMessage } from "./serverMessage/setHintMessage";

export type MessageType = number

export const CJoin: MessageType = 0
export const CLeave: MessageType = 1
export const CSubmit: MessageType = 2
export const CStart: MessageType = 3
export const CNextProblem : MessageType = 4
export const CDeleteRoom: MessageType = 5
export const CSetGameSettings: MessageType = 6
export const CRequestHint: MessageType = 7

export const SAddHiddenSubmission: MessageType = 0
export const SSetShortest: MessageType = 1
export const SFinishGame: MessageType = 2
export const SStart: MessageType = 3
export const SJoin: MessageType = 4
export const SLeave: MessageType = 5
export const SSetPoint: MessageType = 6
export const SAddSubmission: MessageType = 7
export const SSetProblem: MessageType = 8
export const SStartTimelimit : MessageType = 9
export const SFinishProblem : MessageType = 10
export const SStartGame : MessageType = 11
export const SSetRoomInfo : MessageType = 12
export const STellUser : MessageType = 13
export const SUnauth : MessageType = 14
export const SNotify : MessageType = 15
export const SHint : MessageType = 16

export interface Message {
    type: MessageType,
}

export interface ServerMessage extends Message {
    handle: (dispatch: Dispatch<any>) => void,
}
export type ClientMessage = Message

function serverEventHander(msg: any, dispatch: Dispatch<any>) {
    if (Array.isArray(msg)) {
        msg.forEach(imsg => serverEventHander(imsg, dispatch))
        return;
    }
    if (msg.type == undefined) return;
    var smsg : ServerMessage|undefined = undefined
    switch(msg.type) {
        case SAddHiddenSubmission : smsg = new AddHiddenSubmissionMessage(msg); break;
        case SSetShortest : smsg = new SetShortestMessage(msg); break;
        case SFinishGame : smsg = new FinishGameMessage(msg); break;
        case SFinishProblem : smsg = new FinishProblemMessage(msg); break;
        case SJoin : smsg = new JoinMessage(msg); break;
        case SLeave : smsg = new LeaveMessage(msg); break;
        case SSetPoint : smsg = new SetPointMessage(msg); break;
        case SAddSubmission : smsg = new AddSubmissionMessage(msg); break;
        case SSetProblem : smsg = new SetProblemMessage(msg); break;
        case SStartTimelimit : smsg = new StartTimelimitMessage(msg); break;
        case SStartGame : smsg = new StartGameMessage(msg); break;
        case SSetRoomInfo : smsg = new SyncRoomMessage(msg); break;
        case STellUser : smsg = new TellUserMessage(msg); break;
        case SUnauth : smsg = new UnauthErrorMessage(msg); break;
        case SNotify : smsg = new NotifyMessage(msg); break;
        case SHint : smsg = new SetHintMessage(msg); break;
        default: console.error("unknown message type" + msg.type); return;
    }
    smsg.handle(dispatch)
}

function getMsgID(e:any) : [number,string] {
    const s =(e as string) 
    const pos = s.indexOf(",")
    if(pos === -1) {
        throw "invalid message format"
    }
    return [parseInt(s.slice(0, pos)), s.slice(pos + 1, s.length)]
}

export function useServer(url: string) : WsDispatch{
    const ws = useRef<WebSocket>()
    const dispatch = useDispatch()

    useEffect(() => {
        var latestAcceptedMsgID = 0
        const unAcceptedMsgSet = new Map<number, any>()

        ws.current = new WebSocket(url)
        ws.current.onerror = (ev) => {
            console.log(ev)
            dispatch(notify({msg:"connection error"}))
        }
        ws.current.onopen = () =>{
            console.log("ws opened")
            dispatch(quitRoom())
        }
        ws.current.onclose = () => {
            console.log("ws closed");
            dispatch(notify({msg:"room not found"}))
        }
        ws.current.onmessage = e => {
            try {
                console.log("received:" + e.data)
                const [msgID,evstr] = getMsgID(e.data)
                const ev = JSON.parse(evstr)

                unAcceptedMsgSet.set(msgID, ev)
                while (unAcceptedMsgSet.has(latestAcceptedMsgID + 1)) {
                    var nex = latestAcceptedMsgID + 1
                    serverEventHander(unAcceptedMsgSet.get(nex), dispatch)
                    unAcceptedMsgSet.delete(nex)
                    latestAcceptedMsgID++
                }
            } catch (err) {
                console.error(err)
                dispatch(notify({msg:"failed to parse"}))
            }
        };
        return () => {
            ws.current?.close()
        };
    }, [url, dispatch]);

    const wsDispatch = (msg: Message) => {
        console.log("sent"+msg)
        if (ws.current)
            ws.current.send(JSON.stringify(msg))
    }
    return wsDispatch
}

export type WsDispatch = (msg: Message) => void