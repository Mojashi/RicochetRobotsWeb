import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { ProblemView } from "../component/room/game/Problem"
import {  viewProblemSelector, selectedRobotSelector, resultProblemSelector, animNext, animIDSelector, animPathsSelector, animFrameSelector } from "./GameSlice"

type Props = {
	className? : string,
}

export function Problem({className} : Props){
	const problem = useSelector(viewProblemSelector)
	const resultProblem = useSelector(resultProblemSelector)
	const animID = useSelector(animIDSelector)
	const animFrame = useSelector(animFrameSelector)
	const dispatch = useDispatch()
	const paths = useSelector(animPathsSelector)
	const selectedRobot = useSelector(selectedRobotSelector)

	return <>
		{problem !== undefined && 
			<ProblemView className={className} 
				problem={resultProblem? resultProblem : problem} 
				robotPaths={paths} 
				selectedRobot={selectedRobot}
				onTransitionEnd={()=>{setTimeout(()=>dispatch(animNext({animID:animID,animFrame:animFrame?animFrame:0})), 500)}}
			/>
		}
	</>
}
