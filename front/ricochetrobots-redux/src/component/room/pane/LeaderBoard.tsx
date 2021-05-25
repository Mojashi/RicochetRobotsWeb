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
			<TitleStyled color={titleColor} >LEADERBOARD</TitleStyled>
			<LaneStyled>
				{ranking.map((user,idx) => 
					<LeaderBoardUserCard rank={idx + 1} user={user} key={user.user.id}/>
				)}
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