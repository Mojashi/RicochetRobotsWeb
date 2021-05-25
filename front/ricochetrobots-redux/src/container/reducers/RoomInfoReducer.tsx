import {  Draft, PayloadAction } from "@reduxjs/toolkit"
import produce from "immer"
import { WritableDraft } from "immer/dist/internal"

import { RoomInfo } from "../../model/RoomInfo"
import { User, UserID } from "../../model/User"
import { getRoomInfo, getRoomState, getSiteState, RoomState,  State, initialRoomState } from "../GameSlice"
import { joinToGameFunc } from "./GameReducers"

export function notifyFunc(draft : WritableDraft<RoomState> , msg : string, duration? : number){
	if(duration === undefined || duration < 0) duration = 1

	draft.notifications.push({id:Math.random(), msg:msg, duration : duration})
}

export function joinToRoomFunc (draft : Draft<RoomState>, user : User) {
	draft.participants[user.id] = user
	draft.onlineUsers[user.id] = true
	joinToGameFunc(draft, user)
}
export function leaveFromRoomFunc (draft : Draft<RoomState>, userID : UserID) {
	draft.onlineUsers[userID] = false
}
export function setNeedToAuthFunc(draft : Draft<RoomState>, need : boolean) {
	draft.needToAuth = need
}
export function setRoomInfoFunc(draft : Draft<State>, roomInfo : RoomInfo){
	const oldRoomInfo = getRoomInfo(draft) 
	const room = getRoomState(draft)
	const userID = getSiteState(draft).user.id
	setNeedToAuthFunc(room, false)
	if (oldRoomInfo && oldRoomInfo.admin.id !== userID && userID === roomInfo.admin.id) {
		notifyFunc(room, "このルームの親はあなたです")
	}
	room.roomInfo = roomInfo
}
export function removeNotifyFunc(draft : Draft<RoomState>, id : number) {
	draft.notifications = draft.notifications.filter(notif => notif.id !== id)
}
export function failedToAuthFunc(draft : Draft<RoomState>) {
	if (draft.needToAuth) { //まちがえた
		notifyFunc(draft, "あいことばがちがいます")
	} 
	setNeedToAuthFunc(draft, true)
}
export function tellUserFunc(draft : Draft<RoomState>, user : User) {
	draft.participants[user.id] = user
}
export function quitRoomFunc(draft : Draft<State>) {
	draft.roomState = initialRoomState
}

export const RoomInfoReducer = {
	quitRoom : (state:State) => (
		produce(state,draft => quitRoomFunc(draft))
	),
	joinToRoom: (state:State, action : PayloadAction<User>) => (
		produce(state, draft => joinToRoomFunc(getRoomState(draft), action.payload))
	),
	leaveFromRoom: (state:State, action : PayloadAction<UserID>) => (
		produce(state, draft => leaveFromRoomFunc(getRoomState(draft), action.payload))
	),
	setRoomInfo: (state:State, action : PayloadAction<RoomInfo>) => (
		produce(state, draft => setRoomInfoFunc(draft, action.payload))
	),
	notify:(state : State, action : PayloadAction<{msg:string, duration?:number}>) => (
		produce(state, draft => notifyFunc(getRoomState(draft), action.payload.msg, action.payload.duration))
	),
	removeNotify:(state:State, action : PayloadAction<number>) => (
		produce(state, draft => removeNotifyFunc(getRoomState(draft), action.payload))
	),
	tellUser:(state:State, action : PayloadAction<User>) => (
		produce(state,draft => tellUserFunc(getRoomState(draft), action.payload))
	),
	setNeedToAuth:(state:State, action : PayloadAction<boolean>) => (
		produce(state,draft => setNeedToAuthFunc(getRoomState(draft), action.payload))
	),
	failedToAuth:(state:State ) => (
		produce(state,draft => failedToAuthFunc(getRoomState(draft)))
	)
}