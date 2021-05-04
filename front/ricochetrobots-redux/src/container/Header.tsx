import React from "react"
import { useSelector } from "react-redux"
import { HeaderView } from "../component/room/Header"
import { ShortestView } from "../component/room/pane/Shortest"
import { roomNameSelector, shortestSelector, timeLeftSelector } from "./GameSlice"

type Props = {
    className? : string,
}

export function Header({className} : Props){
    const name = useSelector(roomNameSelector)
    const timeLeft = useSelector(timeLeftSelector)

    return <HeaderView roomName={name} timeLeft={timeLeft} className={className}/>
}