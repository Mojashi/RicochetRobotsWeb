import React, { useEffect, useState } from "react"

import { useHistory } from "react-router"
import { getRankingApi } from "../api/getRanking"
import { ArenaPanelView } from "../component/menu/panel/Arena"

import { User } from "../model/User"


type Props = {
	className? : string,
}

export function ArenaPanel({className} : Props){
	const [ranking,setRanking] = useState<User[]>([])
	const history = useHistory()
	useEffect(()=>{
		getRankingApi(setRanking)
	},[])
	return <ArenaPanelView 
		ranking={ranking} 
		onClickJoin={()=>{history.push("/room/0")}}
		className={className}/>
}