import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { GameResultView } from "../component/room/GameResult"
import { UserExample } from "../model/User"
import { gameResultSelector,setGameResult, showGameResultSelector } from "./GameSlice"
export function GameResult({className} : {className? : string}) {
    const dispatch = useDispatch()
    const leaderboard = useSelector(gameResultSelector)
    const showGameResult = useSelector(showGameResultSelector)

    return  <GameResultView 
        onEntered={()=>{setTimeout(()=>dispatch(setGameResult([])), 5000)}}
        winner={ showGameResult && leaderboard && leaderboard.length > 0?leaderboard[0]:undefined}
        className={className}/>
}