import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useHistory } from "react-router"
import { getRankingApi } from "../api/getRanking"
import { ArenaPanelView } from "../component/menu/panel/Arena"
import { LeaderBoardView } from "../component/room/pane/LeaderBoard"
import { User } from "../model/User"
import {leaderBoardSelector} from "./GameSlice"

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