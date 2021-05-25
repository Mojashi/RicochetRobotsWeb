import React from "react"
import styled from "styled-components"
import { LeaderBoardUser } from "./pane/LeaderBoard"
//@ts-ignore
import { Textfit } from "react-textfit"
import { UserIcon } from "../accessory/UserIcon"
import { CSSTransition } from "react-transition-group"


type Props = {
	winner? : LeaderBoardUser
	onEntered : ()=>void,
	className? : string
}

export function GameResultView ({className, winner, onEntered} : Props) {
	return <>
		<CSSTransitionStyled className={className} in={winner !== undefined} timeout={800} onEntered={onEntered}>
			{winner ?
				<InnerDiv>
					<WinnerText>WINNER</WinnerText>
					<NameText><UserIconStyled userID={winner!.user.id}/>{" "+winner!.user.name.toUpperCase()}</NameText>
				</InnerDiv> : <></>
			}
		</CSSTransitionStyled>
	</>
}

const InnerDiv = styled("div")`
	position:"relative";
	width:"100%";
	height:"100%";
	background: rgba(0,0,0, 0.4);

	&.enter, &.exit-active {
		background: rgba(0,0,0, 0);
	}
	&.enter-active, &.exit {
		background: rgba(0,0,0, 0.4);
	}

	&.enter-active, &.exit-active{
	  transition: all 800ms;
	}
`

const UserIconStyled = styled(UserIcon)`
	height:1em;
`
const WinnerText = styled(Textfit)`
	color: white;
	font-weight:bold;
	width:50%;
	height:40%;
	display:flex;
	align-items:flex-end;
	justify-content:center;
	margin-left:auto;
	margin-right:auto;
`
const NameText = styled(Textfit)`
	color: white;
	font-weight:bold;
	width:90%;
	height:60%;
	margin-left:auto;
	margin-right:auto;
`
const CSSTransitionStyled = styled(CSSTransition) `
	width : 100%;
	height : 100%;
	font-family: 'Fjalla One', sans-serif;
`  