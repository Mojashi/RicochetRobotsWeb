import React, { useEffect, useState } from "react"
import { getRoomListApi } from "../api/getRoomList"
import { RoomsPanelView } from "../component/menu/panel/rooms/Rooms"
import { RoomAbstract } from "../model/RoomInfo"

export function RoomsPanel() {
	const [rooms,setRooms] = useState<RoomAbstract[]>([])
	const load =()=>{
		setRooms([])
		getRoomListApi(setRooms)
	}
	useEffect(load, [])
	return <RoomsPanelView onClickReload={load} rooms={rooms}/>	
}