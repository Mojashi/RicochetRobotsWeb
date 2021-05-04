import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ProblemView } from "../component/room/game/Problem"
import { possSelector, problemSelector, selectedRobotSelector, setProblem } from "./GameSlice"

type Props = {
    className? : string,
}

export function Problem({className} : Props){
    const problem = useSelector(problemSelector)
    const poss = useSelector(possSelector)
    const selectedRobot = useSelector(selectedRobotSelector)

    return <>
        {problem !== undefined && 
            <ProblemView className={className} problem={problem} robotPoss={poss} selectedRobot={selectedRobot}/>}
    </>
}
