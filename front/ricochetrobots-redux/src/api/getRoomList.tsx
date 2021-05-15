import { RoomAbstract } from "../model/RoomInfo";
import { AnonymousUser, User } from "../model/User";
import { API_SERVER } from "./api";

export function getRoomListApi(callBack : (rooms : RoomAbstract[])=>void){
    fetch(API_SERVER + "/rooms")
    .then((res) => {
		if(!res.ok){
		  throw new Error(res.statusText);
		}
		return res.json()
	})
    .then((data) => {callBack((data as RoomAbstract[]).sort((a,b)=>a.id - b.id)); console.log(data)})
    .catch((err) => {callBack([]); console.log("failed to get roomlist " + err)});
    
}