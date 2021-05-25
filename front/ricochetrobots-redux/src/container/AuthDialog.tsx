import React, { useContext } from "react"
import { AuthDialogView } from "../component/room/AuthDialog"
import { WsDispatchContext } from "./Room"
import { JoinMessage } from "./websocket/clientMessage/joinMessage"

type Props = {
	className? : string,
}

export function AuthDialog({className} : Props){
	const wsDispatch = useContext(WsDispatchContext)

	return <AuthDialogView className={className} onClickSend={wsDispatch? (pass)=>wsDispatch(new JoinMessage(pass)) : undefined}/>
}