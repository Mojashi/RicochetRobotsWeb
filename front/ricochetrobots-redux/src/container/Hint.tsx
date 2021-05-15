import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { HintView } from "../component/room/pane/Hint"
import { LeaderBoardView } from "../component/room/pane/LeaderBoard"
import {hintSelector, leaderBoardSelector} from "./GameSlice"

type Props = {
    className? : string,
}

export function Hint({className} : Props){
    const hint = useSelector(hintSelector)
    const dispatch = useDispatch()
    return <>{hint  && <HintView onClick={()=>{}} hint={hint ? hint : []} className={className}/>} </>
}