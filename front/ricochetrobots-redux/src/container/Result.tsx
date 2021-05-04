import React from "react"
import { useSelector } from "react-redux"
import { ResultView } from "../component/room/pane/Result"
import { ShortestView } from "../component/room/pane/Shortest"
import { resultSelector } from "./GameSlice"

type Props = {
    className? : string,
}

export function Result({className} : Props){
    const subs = useSelector(resultSelector)
    return <ResultView subs={subs?subs:[]} className={className}/>
}