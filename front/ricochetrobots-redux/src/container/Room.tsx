import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router"
import { RoomView } from "../component/room/Room"

import { intervalSelector, onGameSelector, finishResult,  roomInfoSelector, needToAuthSelector, isAdminSelector, quitRoom, readyNextSelector, setReadyNext } from "./GameSlice"
import { useServer, WsDispatch } from "./websocket/WebsocketEventHandler"

import { NextProblemRequestMessage } from "./websocket/clientMessage/nextProblemRequestMessage"
import { WS_SERVER } from "../api/api"
import { isMobile } from "react-device-detect"
import { RoomViewMobile } from "../component/room/RoomMobile"

export const WsDispatchContext = React.createContext<WsDispatch|undefined>(undefined)

export function Room(){
	const {roomID} = useParams<{roomID?:string}>()
	const onGame = useSelector(onGameSelector)
	const interval = useSelector(intervalSelector)
	const readyNext = useSelector(readyNextSelector)
	const room = useSelector(roomInfoSelector)
	const wsDispatch = useServer(`${WS_SERVER}/join/${roomID}`)
	const dispatch = useDispatch()
	const isAdmin = useSelector(isAdminSelector)
	const needToAuth = useSelector(needToAuthSelector)

	//ここと、useServer内に分散してるのよくない
	useEffect(()=>{
		return ()=>{dispatch(quitRoom())}
	}, [])

	const View = isMobile ? RoomViewMobile : RoomView
	return (
		<WsDispatchContext.Provider value={wsDispatch}>
			<View 
				room={room} 
				isAdmin={isAdmin}
				onGame={onGame}
				interval={interval}
				onNextClick={isAdmin ? 
					()=>{wsDispatch(new NextProblemRequestMessage());dispatch(finishResult())} : 
					()=>{dispatch(onGame ? setReadyNext(!readyNext) : finishResult())}
				}
				readyNext={readyNext ? readyNext : false}
				needToAuth={needToAuth}
			/>
		</WsDispatchContext.Provider>
	)
}