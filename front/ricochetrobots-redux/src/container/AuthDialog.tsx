import React, { useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AuthDialogView } from "../component/room/AuthDialog"
import { HeaderView } from "../component/room/Header"
import { ShortestView } from "../component/room/pane/Shortest"
import { notifSelector, removeNotify, roomInfoSelector, shortestSelector, timeLeftSelector } from "./GameSlice"
import { WsDispatchContext } from "./Room"
import { JoinMessage } from "./websocket/clientMessage/joinMessage"

type Props = {
    className? : string,
}

export function AuthDialog({className} : Props){
    const wsDispatch = useContext(WsDispatchContext)

    return <AuthDialogView onClickSend={wsDispatch? (pass)=>wsDispatch(new JoinMessage(pass)) : undefined}/>
}