import React from "react"
import { useSelector } from "react-redux"

import { UserNavView } from "../component/usernav/UserNav"
import { userSelector } from "./GameSlice"



type Props = {
	className? : string,
}

export function UserNav({className} : Props){
	const user = useSelector(userSelector)
	return <UserNavView user={user} className={className}/>
}