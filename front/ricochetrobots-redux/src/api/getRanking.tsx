
import {  User } from "../model/User"
import { API_SERVER } from "./api"

export function getRankingApi(callBack : (rooms : User[])=>void){
	fetch(API_SERVER + "/users/ranking")
		.then((res) => {
			if(!res.ok){
				throw new Error(res.statusText)
			}
			return res.json()
		})
		.then((data) => {callBack(data as User[])})
		.catch((err) => {callBack([]); console.log("failed to get ranking " + err)})
	
}