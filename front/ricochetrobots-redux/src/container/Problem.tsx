import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { ProblemView } from "../component/room/game/Problem"
import {  viewProblemSelector, selectedRobotSelector, resultProblemSelector, animNext, animIDSelector, animPathsSelector } from "./GameSlice"

type Props = {
	className? : string,
}

export function Problem({className} : Props){
	const problem = useSelector(viewProblemSelector)
	const resultProblem = useSelector(resultProblemSelector)
	const animID = useSelector(animIDSelector)
	const dispatch = useDispatch()
	const paths = useSelector(animPathsSelector)
	const selectedRobot = useSelector(selectedRobotSelector)

	return <>
		{problem !== undefined && 
			<ProblemView className={className} 
				problem={resultProblem? resultProblem : problem} 
				robotPaths={paths} 
				selectedRobot={selectedRobot}
				onTransitionEnd={()=>{setTimeout(()=>dispatch(animNext(animID)), 500)}}
			/>
		}
	</>
}
