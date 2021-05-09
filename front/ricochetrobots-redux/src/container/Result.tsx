import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { ResultView } from "../component/room/pane/Result"
import { ShortestView } from "../component/room/pane/Shortest"
import { ResultSubmission } from "../model/game/Submission"
import { animStart, animStop, resultAnimSubSelector, resultSubsSelector } from "./GameSlice"

type Props = {
    className? : string,
}

export function Result({className} : Props){
    const subs = useSelector(resultSubsSelector)
    const selectedSub = useSelector(resultAnimSubSelector)
    const dispatch = useDispatch()

    return <ResultView subs={subs?subs:[]} className={className}
        onClick={(sub:ResultSubmission)=>{
            if(selectedSub?.id == sub.id) 
                dispatch(animStop())
            else
                dispatch(animStart(sub))
        }}
        selectedID={selectedSub?.id}
        />
}