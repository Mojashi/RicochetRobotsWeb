import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { HeaderView } from "../component/room/Header"
import { ShortestView } from "../component/room/pane/Shortest"
import { notifSelector, removeNotify, roomInfoSelector } from "./GameSlice"

type Props = {
    className? : string,
}

export function Header({className} : Props){
    const room = useSelector(roomInfoSelector)
    const notifs = useSelector(notifSelector)
    const dispatch = useDispatch()

    return <HeaderView roomName={room ? room.name : ""} className={className}
     msgs={notifs} onMsgEntered={(id:number)=>setTimeout(()=>dispatch(removeNotify(id)), 1000)}/>
}