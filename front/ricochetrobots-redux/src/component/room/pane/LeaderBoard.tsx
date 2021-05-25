import React from "react"
import styled from "styled-components"
import { User } from "../../../model/User"
import { LeaderBoardUserCard } from "./card/LeaderBoardUserCard"
import { Lane } from "./Lane"
import {Title} from "./Title"

export type LeaderBoardUser = {
	user : User,
	point:number,
	online : boolean,
}

type Props = {
	className? : string,
	ranking: LeaderBoardUser[],
	titleColor? : string,
}

export function LeaderBoardView({titleColor, ranking, className} : Props) {
	return (
		<Div className = {className}>
			<Title color={titleColor} >LEADERBOARD</Title>
			<LaneStyled>
				{ranking.map((user,idx) => 
					<LeaderBoardUserCard rank={idx + 1} user={user} key={user.user.id}/>
				)}
			</LaneStyled>
		</Div>
	)
}
const LaneStyled = styled(Lane)`
	margin-top:0.7em;
	flex-grow:1;
	overflow:hidden;
`

const Div = styled("div")`
	width:100%;
	display:flex;
	flex-direction:column;
`