import React from "react"
import { useSelector } from "react-redux"
import { LeaderBoardView } from "../component/room/pane/LeaderBoard"
import {leaderBoardSelector} from "./GameSlice"

export function LeaderBoard(props : Omit<React.ComponentProps<typeof LeaderBoardView>, "ranking">){
    const ranking = useSelector(leaderBoardSelector)
    

    return <LeaderBoardView ranking={ranking} {...props}/>
}