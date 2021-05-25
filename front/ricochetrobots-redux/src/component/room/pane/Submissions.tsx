import React from "react"
import { isBrowser, isMobile } from "react-device-detect"
import styled from "styled-components"
import { Submission } from "../../../model/game/Submission"
import { SubmissionCard } from "./card/SubmissionCard"
import {Title} from "./Title"

type Props = {
	className? : string,
	subs : Submission[],
}

export function SubmissionsView({subs, className} : Props) {
	return (
		<Div className={className}>
			{isBrowser && <TitleStyled>SUBMISSIONS</TitleStyled>}
			<Cards>
				{subs.slice(Math.max(subs.length - 5, 0), subs.length).map((sub,idx) => 
					<SubmissionCard sub={sub} key={sub.id} rank={Math.max(subs.length - 5, 0) + idx + 1}/>
				)}
			</Cards>
		</Div>
	)
}
const TitleStyled = styled(Title)`
    margin-bottom:0.7em;
`
const Cards = styled("div")`
	display:flex;
	gap:0.7em;
	flex-direction:column-reverse;
	${isMobile&& `
		flex-direction:row-reverse;
		justify-content:flex-end;
	`};
`
const Div = styled("div")`
	width:100%;
	height:fit-content;
`