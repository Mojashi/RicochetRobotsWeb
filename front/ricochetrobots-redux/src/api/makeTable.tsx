import {  RoomSettings } from "../model/RoomInfo"

import { API_SERVER } from "./api"

export function makeTableApi(roomSettings : RoomSettings, callBack : (roomID : number)=>void, onError : (err : string)=>void){
	fetch(API_SERVER + "/rooms/make", {
		method:"POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
		},
		body:JSON.stringify(roomSettings),
	})
		.then((res) => {
			if(!res.ok){
				res.json().then((err)=>onError(err["message"]))
				throw new Error(res.statusText)
			}
			return res.json()
		})
		.then((data) => { console.log(data);callBack(data["roomID"] as number)})
		.catch((err) => {console.log("failed to makeTable " + err)})
}