import React from "react"
import styled from "styled-components"
import { PALETTE } from "../../../../app/palette"
import { ResultSubmission } from "../../../../model/game/Submission"
import { UserIcon } from "../../../accessory/UserIcon"

import { Chip } from "../../../menu/panel/component/Chip"
import { Card } from "./Card"

type Props = {
	className? : string,
	sub : ResultSubmission,
	rank : number,
	selected : boolean,
	onClick? : (sub:ResultSubmission)=>void,
}

export function ResultSubmissionCard({sub, rank, className, selected, onClick} : Props) {
	return (
		<CardStyled index={rank} className={(sub.isFirst ? " unique" : "") + (className?className:"")}
			color={sub.optimal?PALETTE.gold:PALETTE.paper}
			onClick={onClick ? ()=>onClick(sub) : undefined}
			selected={selected}
		>
			<UpperDiv>
				<MovesDiv>{sub.length} moves</MovesDiv>
				{/* <PlayIcon/> */}
			</UpperDiv>
			<LowerDiv>
				<AuthorDiv>
					<UserIconStyled userID={sub.user.id}/>{sub.user.name}
				</AuthorDiv>
				{sub.addedPoint > 0 && 
					<ChipStyled fill={PALETTE.paleGold} color={"black"}>
						{`+${sub.addedPoint}pt`}
					</ChipStyled>
				}
			</LowerDiv>
		</CardStyled>
	)
}
ResultSubmissionCard.defaultProps = {
	selected : false,
}

const UpperDiv = styled("div")`
	display:flex;
`
const LowerDiv = styled("div")`
	display:flex;
	justify-content: space-between;
`
const ChipStyled = styled(Chip) `
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`
const CardStyled = styled(Card)`
	cursor: pointer;
	
	&.unique {
		&::before {
			position: absolute;
			color :#59B42E;
			border: solid #59B42E 0.2em;
			border-radius: 3px;
			font-weight: bold;
			content: "UNIQUE";
			right : -1em;
			top: 0.5em;
			transform: rotate(50deg);
		}
	}
`

const MovesDiv = styled("div")`
	white-space:nowrap;
	font-size:1.5em;
	font-weight:bold;
	padding:0 0.7em 0 0.7em;
`
const AuthorDiv = styled("div")`
	font-size:0.9em;
	text-align:right;
	font-weight:bold;
	display:flex;
	align-items:center;
	justify-content:flex-end;
`

const UserIconStyled = styled(UserIcon)`
	height:2em;
`