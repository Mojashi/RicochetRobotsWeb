import { RoomInfo, RoomSettings } from "../model/RoomInfo";
import { AnonymousUser, User } from "../model/User";
import { API_SERVER } from "./api";

export function makeTableApi(roomSettings : RoomSettings, callBack : (roomID : number)=>void){
    fetch(API_SERVER + "/makeRoom", {
        method:"POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(roomSettings),
    })
    .then((res) => {
		if(!res.ok){
		    throw new Error(res.statusText);
		}
		return res.json()
	})
    .then((data) => { console.log(data);callBack(data["roomID"] as number);})
    .catch((err) => {console.log("failed to makeTable " + err)});
}