import React, { useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HintView } from "../component/room/pane/Hint"
import { LeaderBoardView } from "../component/room/pane/LeaderBoard"
import {hintPlayingSelector, hintSelector, intervalSelector, isAdminSelector, leaderBoardSelector, onGameSelector, playHint, stopHint} from "./GameSlice"
import { WsDispatchContext } from "./Room"
import { RequestHintMessage } from "./websocket/clientMessage/requestHintMessage"

type Props = {
    className? : string,
}

export function Hint({className} : Props){
    const wsDispatch = useContext(WsDispatchContext)
    const hintPlaying = useSelector(hintPlayingSelector)
    const hint = useSelector(hintSelector)
    const isAdmin = useSelector(isAdminSelector)
    const interval = useSelector(intervalSelector)
    const onGame = useSelector(onGameSelector)
    const dispatch = useDispatch()

    return <>{!interval && onGame && ((hint && hint.length > 0) || isAdmin) &&
    <HintView 
        hint={hint ? hint : []} 
        showHintButton={isAdmin}
        className={className}
        hintPlaying={hintPlaying ? hintPlaying : false}
        onClickGetHint={()=>{wsDispatch && wsDispatch(new RequestHintMessage())}}
        onClickPlayHint={()=>dispatch(hintPlaying ? stopHint() : playHint())}
    />} </>
}