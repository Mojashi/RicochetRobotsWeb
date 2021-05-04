import React, { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router"
import { RoomView } from "../component/room/Room"
import { TestRule } from "../model/game/Rule"
import { intervalSelector, onGameSelector, roomIDSelector } from "./GameSlice"
import { useServer, WsDispatch } from "./websocket/WebsocketEventHandler"
import { StartGameRequestMessage } from "./websocket/clientMessage/startGameRequestMessage"

export const WsDispatchContext = React.createContext<WsDispatch|undefined>(undefined);

export function Room(){
    const {roomID} = useParams<{roomID?:string}>()
    const wsDispatch = useServer(`ws://${document.domain}:3000/api/join/${roomID}`)
    const onGame = useSelector(onGameSelector)
    const interval = useSelector(intervalSelector)

    return (
        <WsDispatchContext.Provider value={wsDispatch}>
            <RoomView 
                room={{id:0, name:"テストルーム", users:[], rule:TestRule}} 
                onGame={onGame}
                interval={interval}
                startButton={()=>wsDispatch(new StartGameRequestMessage())}/>
        </WsDispatchContext.Provider>
    )
}