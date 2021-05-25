import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { ResultView } from "../component/room/pane/Result"

import { ResultSubmission } from "../model/game/Submission"
import {   resultAnimSubSelector, resultSubsSelector,playResultSub,stopResultSub } from "./GameSlice"

type Props = {
	className? : string,
}

export function Result({className} : Props){
	const subs = useSelector(resultSubsSelector)
	const selectedSub = useSelector(resultAnimSubSelector)
	const dispatch = useDispatch()

	return <ResultView subs={subs?subs:[]} className={className}
		onClick={(sub:ResultSubmission)=>{
			if(selectedSub?.id === sub.id) 
				dispatch(stopResultSub())
			else
				dispatch(playResultSub(sub))
		}}
		selectedID={selectedSub?.id}
	/>
}