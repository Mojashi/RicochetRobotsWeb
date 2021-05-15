import React, { useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ShortestView } from "../component/room/pane/Shortest"
import { UserNavView } from "../component/usernav/UserNav"
import { shortestSelector,userSelector,loggedInSelector } from "./GameSlice"
import Icon from "../img/usericon.jpg"
import AnonIcon from "../img/anonymous.png"
import { GameSettingPanelView } from "../component/room/GameSettingPanel"
import { WsDispatchContext } from "./Room"
import { StartGameRequestMessage } from "./websocket/clientMessage/startGameRequestMessage"
import { GameConfig } from "../model/game/GameConfig"

type Props = {
    className? : string,
}

export function GameSettingPanel({className} : Props){
    const dispatch = useDispatch()
    const wsDispatch = useContext(WsDispatchContext)

    return <GameSettingPanelView className={className}
        onClickStart={wsDispatch ? (gameConfig:GameConfig)=>wsDispatch(new StartGameRequestMessage(gameConfig)) : undefined}/>
}