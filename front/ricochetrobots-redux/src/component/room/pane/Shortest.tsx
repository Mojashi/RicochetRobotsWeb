import React from "react"
import styled from "styled-components"
import { Submission } from "../../../model/game/Submission"

import { SubmissionCard } from "./card/SubmissionCard"
import {Title} from "./Title"

type Props = {
	className? : string,
	sub? : Submission,
	titleColor?:string,
}

export function ShortestView({sub,titleColor, className} : Props) {
	return (
		<Div className = {className}>
			<TitleStyled color={titleColor}>SHORTEST</TitleStyled>
			{sub ? 
				<SubmissionCard sub={sub} rank={1}/> : 
				""
			}
		</Div>
	)
}

const TitleStyled = styled(Title)`
    margin-bottom:0.7em;
`
const Div = styled("div")`
	width:100%;
	height:fit-content;
`