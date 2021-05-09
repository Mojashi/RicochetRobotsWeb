import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ProblemView } from "../component/room/game/Problem"
import { possSelector, viewProblemSelector, selectedRobotSelector, resultProblemSelector, animNext, resultAnimIDSelector, intervalSelector } from "./GameSlice"

type Props = {
    className? : string,
}

export function Problem({className} : Props){
    const problem = useSelector(viewProblemSelector)
    const resultProblem = useSelector(resultProblemSelector)
    const animID = useSelector(resultAnimIDSelector)
    const dispatch = useDispatch()
    const poss = useSelector(possSelector)
    const selectedRobot = useSelector(selectedRobotSelector)
    const interval = useSelector(intervalSelector)

    return <>
        {problem !== undefined && 
            <ProblemView className={className} 
                problem={resultProblem? resultProblem : problem} 
                robotPoss={poss} 
                selectedRobot={selectedRobot}
                onTransitionEnd={resultProblem && animID ? ()=>{setTimeout(()=>dispatch(animNext(animID)), 500)} : undefined}
            />
        }
    </>
}
