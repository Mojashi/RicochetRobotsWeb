import React, { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router"
import { RoomView } from "../component/room/Room"
import { FirstToWin } from "../model/game/Rule"
import { intervalSelector, onGameSelector, finishResult, problemExistsSelector, roomInfoSelector, needToAuthSelector } from "./GameSlice"
import { useServer, WsDispatch } from "./websocket/WebsocketEventHandler"
import { StartGameRequestMessage } from "./websocket/clientMessage/startGameRequestMessage"
import { userSelector } from "./SiteSlice"
import { NextProblemRequestMessage } from "./websocket/clientMessage/nextProblemRequestMessage"

export const WsDispatchContext = React.createContext<WsDispatch|undefined>(undefined);

export function Room(){
    const {roomID} = useParams<{roomID?:string}>()
    const onGame = useSelector(onGameSelector)
    const interval = useSelector(intervalSelector)
    const readyToNext = useSelector(problemExistsSelector)
    const room = useSelector(roomInfoSelector)
    const user = useSelector(userSelector)
    const wsDispatch = useServer(`ws://${document.domain}:3000/api/join/${roomID}`)
    const dispatch = useDispatch()
    const isAdmin = user.id === room?.admin.id
    const needToAuth = useSelector(needToAuthSelector)

    return (
        <WsDispatchContext.Provider value={wsDispatch}>
            <RoomView 
                room={room} 
                isAdmin={isAdmin}
                onGame={onGame}
                interval={interval}
                onNextClick={isAdmin ? 
                    ()=>{wsDispatch(new NextProblemRequestMessage());dispatch(finishResult())} : 
                    ()=>{dispatch(finishResult())}
                }
                readyToNext={readyToNext}
                needToAuth={needToAuth}
            />
        </WsDispatchContext.Provider>
    )
}