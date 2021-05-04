import { AnonymousUser, User } from "../model/User";
import { API_SERVER } from "./api";

export function fetchMeApi(callBack : (user : User)=>void){
    fetch(API_SERVER + "/me")
    .then((res) => {
		if(!res.ok){
		  throw new Error(res.statusText);
		}
		return res.json()
	})
    .then((data) => {callBack(data as User); console.log(data)})
    .catch((err) => {callBack(AnonymousUser); console.log("failed to fetchMe")});
    
}