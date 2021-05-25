import { AnonymousUser, User } from "../model/User"
import { API_SERVER } from "./api"

export function getMeApi(callBack : (user : User)=>void){
	fetch(API_SERVER + "/users/me")
		.then((res) => {
			if(!res.ok){
				throw new Error(res.statusText)
			}
			return res.json()
		})
		.then((data) => {callBack(data as User); console.log(data)})
		.catch(() => {callBack(AnonymousUser); console.log("failed to fetchMe")})
	
}