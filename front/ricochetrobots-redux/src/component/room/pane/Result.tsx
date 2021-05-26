import React from "react"
import { isBrowser, isMobile } from "react-device-detect"
import styled from "styled-components"
import { ResultSubmission } from "../../../model/game/Submission"


import { ResultSubmissionCard } from "./card/ResultSubmissionCard"

import { Lane } from "./Lane"
import {Title} from "./Title"

type Props = {
	className? : string,
	subs : ResultSubmission[],
	onClick : (sub:ResultSubmission)=>void,
	selectedID? : number,
}

export function ResultView({className, subs, onClick, selectedID} : Props) {
	return (
		<Div className = {className}>
			{isBrowser&&<TitleStyled>RESULT</TitleStyled>}
			<LaneStyled dir={isMobile?"row":"col"}>
				<Cards>
					{subs.map((sub, idx) => 
						<ResultSubmissionCard key={sub.id} sub={sub} rank={idx + 1} onClick={onClick} selected={selectedID === sub.id}/>
					)}
				</Cards>
			</LaneStyled>
		</Div>
	)
}

const TitleStyled = styled(Title)`
    margin-bottom:0.7em;
`
const LaneStyled = styled(Lane)`
	flex-grow:1;
	overflow:hidden;
`

const Div = styled("div")`
	width:100%;
	display:flex;
	flex-direction:column;
`

const Cards = styled("div")`
	width:fit-content;
	display:flex;
	gap:0.7em;
	flex-direction:column;
	${isMobile? `
		flex-direction:row;
	`:`
		margin-top:0.7em;
	`};
`