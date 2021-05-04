import React from "react"
import { useSelector } from "react-redux"
import { LeaderBoardView } from "../component/room/pane/LeaderBoard"
import {leaderBoardSelector} from "./GameSlice"

type Props = {
    className? : string,
}

export function LeaderBoard({className} : Props){
    const ranking = useSelector(leaderBoardSelector)

    return <LeaderBoardView ranking={ranking} className={className}/>
}