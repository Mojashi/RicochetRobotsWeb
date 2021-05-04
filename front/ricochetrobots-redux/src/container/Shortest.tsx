import React from "react"
import { useSelector } from "react-redux"
import { ShortestView } from "../component/room/pane/Shortest"
import { shortestSelector } from "./GameSlice"

type Props = {
    className? : string,
}

export function Shortest({className} : Props){
    const sub = useSelector(shortestSelector)

    return <ShortestView sub={sub} className={className}/>
}