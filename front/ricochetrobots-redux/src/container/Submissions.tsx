import React from "react"
import { useSelector } from "react-redux"
import { SubmissionsView } from "../component/room/pane/Submissions"
import {submissionsSelector} from "./GameSlice"

type Props = {
	className? : string,
}

export function Submissions({className} : Props){
	const subs = useSelector(submissionsSelector)

	return <SubmissionsView subs={subs ? subs : []} className={className}/>
}