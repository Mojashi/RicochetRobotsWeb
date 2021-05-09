import { Action, Draft, PayloadAction } from "@reduxjs/toolkit";
import produce from "immer";
import { WritableDraft } from "immer/dist/internal";
import { Writable } from "node:stream";
import { RoomInfo } from "../../model/RoomInfo";
import { User, UserID } from "../../model/User";
import { RoomState, setNeedToAuth } from "../GameSlice";
import { joinToGameFunc } from "./GameReducers";

export function notifyFunc(draft : WritableDraft<RoomState> , msg : string){
    draft.notifications.push({id:Math.random(), msg:msg})
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

export const RoomInfoReducer = {
    joinToRoom: (state:RoomState, action : PayloadAction<User>) => (
        produce(state, draft => joinToRoomFunc(draft, action.payload))
    ),
    leaveFromRoom: (state:RoomState, action : PayloadAction<UserID>) => (
        produce(state, draft => leaveFromRoomFunc(draft, action.payload))
    ),
    setRoomInfo: (state:RoomState, action : PayloadAction<RoomInfo>) => (
        produce(state, draft => {
            setNeedToAuthFunc(draft, false)
            if (draft.roomInfo && draft.roomInfo.admin === ) {
            }
            draft.roomInfo = action.payload
        })
    ),
    notify:(state : RoomState, action : PayloadAction<string>) => (
        produce(state, draft => notifyFunc(draft, action.payload))
    ),
    removeNotify:(state:RoomState, action : Action) => (
        produce(state, draft => {
            draft.notifications.shift()
        })
    ),
    tellUser:(state:RoomState, action : PayloadAction<User>) => (
        produce(state,draft => {
            draft.participants[action.payload.id] = action.payload
        })
    ),
    setNeedToAuth:(state:RoomState, action : PayloadAction<boolean>) => (
        produce(state,draft => setNeedToAuthFunc(draft, action.payload))
    ),
    failedToAuth:(state:RoomState, action : Action) => (
        produce(state,draft => {
            if (draft.needToAuth) { //まちがえた
                notifyFunc(draft, "あいことばがちがいます")
            } 
            setNeedToAuthFunc(draft, true)
        })
    )
}