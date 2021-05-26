import React from "react"
import { isMobile } from "react-device-detect"
import { useDispatch, useSelector } from "react-redux"
import { HeaderView } from "../component/room/Header"
import { HeaderViewMobile } from "../component/room/HeaderMobile"

import { notifSelector, removeNotify, roomInfoSelector,Notification } from "./GameSlice"

type Props = {
	className? : string,
}

export function Header({className} : Props){
	const room = useSelector(roomInfoSelector)
	const notifs = useSelector(notifSelector)
	const dispatch = useDispatch()
	const View = isMobile ? HeaderViewMobile : HeaderView
	return <View roomName={room?.name} className={className}
		notifs={notifs} onMsgEntered={(notif:Notification)=>
			setTimeout(()=>{
				dispatch(removeNotify(notif.id))
			}, notif.duration*1000)}/>
}