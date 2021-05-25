import React from "react"
import styled from "styled-components"
import WoodImg from "../../img/wood.jpg"
import { Input } from "../../container/Input"
import { Problem } from "../../container/Problem"
import {Submissions} from "../../container/Submissions"
import { Shortest } from "../../container/Shortest"
import { LeaderBoard } from "../../container/LeaderBoard"
import { Header } from "../../container/Header"
import { Result } from "../../container/Result"
import { WoodButton } from "./pane/Input/WoodButton"
import { PALETTE } from "../../app/palette"
import { Title } from "./pane/Title"
import { GameSettingPanel } from "../../container/GameSettingPanel"
import { RoomInfo } from "../../model/RoomInfo"
import ReactTooltip from "react-tooltip"
import { AuthDialog } from "../../container/AuthDialog"
import { GameResult } from "../../container/GameResult"
import { Hint } from "../../container/Hint"

interface Props {
	room? : RoomInfo,
	isAdmin : boolean,
	onGame : boolean,
	interval : boolean,
	readyNext : boolean,
	onNextClick : ()=>void,
	needToAuth : boolean,
}

export function RoomView({ onGame, interval,needToAuth, onNextClick, isAdmin,readyNext} : Props){
	const CenterElem = <CenterDiv>
		{onGame || interval ? 
			<Problem/> : 
			isAdmin ?
				<GameSettingPanel/> :
				<Text>開始を待っています...</Text>
		}
	</CenterDiv>

	const ResultSideDiv = <>
		<ResultStyled/>
		<div data-tip="親の開始を待っています" style={{height:"4em"}}>
			<WoodButtonStyled pushed={readyNext} onClick={onNextClick}>
				<Title style={{border:"none"}}>{onGame ? (readyNext? "WAITING":"NEXT") : "FINISH"}</Title>
			</WoodButtonStyled> 
		</div>
		{(readyNext && onGame && !isAdmin) && <ReactTooltip place="right" type="dark" effect="float"/>}
	</>

	const ContentElem = 
	<Content>
		<SideDiv>
			<SideDivContent>
				{interval ? ResultSideDiv:
					<>
						<HintStyled/>
						<ShortestStyled/>
						<SubmissionsStyled/>
					</>}
			</SideDivContent>
		</SideDiv>
		{CenterElem}
		<SideDiv>
			<SideDivContent>
				<InputStyled/>
				<LeaderBoardStyled/>
			</SideDivContent>
		</SideDiv>
	</Content>
	

	return (<>
		<Div>
			<HeaderStyled/>
			{needToAuth ? <Content><AuthDialog/></Content> : ContentElem}	   
		</Div>
		<GameResultStyled/>
	</>
	)
}

const GameResultStyled = styled(GameResult) `
	left:0;
	top:0;
	position: absolute;
	width:100%;
	height:100%;
`
const InputStyled = styled(Input)`
	height:9.3em;
	margin-bottom:1em;
`
const LeaderBoardStyled = styled(LeaderBoard)`
	height:calc(100% - 10.3em);
`
const ShortestStyled = styled(Shortest) `
	margin-bottom:1.5em;
	flex-shrink:0;
`
const HintStyled = styled(Hint) `
margin-bottom:1.5em;
flex-shrink:0;
`
const SubmissionsStyled = styled(Submissions)`
	flex-shrink:1;
	height:100%;
`
const WoodButtonStyled = styled(WoodButton)`
	padding:0.5em 0 0.5em 0;
`
const ResultStyled = styled(Result) `
height:calc(100% - 5em);
margin-bottom:1em;
`

const HeaderStyled = styled(Header)`
	height:3.5em;
`

const Div = styled("div")`
	background-image:url(${WoodImg});
	height:100%;
	width:100%;
`
const Content = styled("div")`
	overflow:hidden;
	width:100%;
	height:calc(100% - 3.5em);
	display:flex;
	align-items:center;
`

const centerSize = "(100vmin - 5.5em)"
const CenterDiv = styled("div")`
	height:calc(${centerSize});
	width:calc(${centerSize});
`
const SideDiv = styled("div")`
	width:calc(50% - ${centerSize}/2);
	height:100%;
	box-sizing:border-box;
`

const SideDivContent = styled("div")`
	box-sizing:border-box;
	margin:auto;
	padding: 0.5em;
	height:100%;
	display:flex;
	justify-content:flex-start;
	flex-direction:column;
	width:fit-content;
`
const Text = styled("div")`
	font-size:2em;
	font-weight:bold;
	color : ${PALETTE.wood};
	height:100%;
	display:flex;
	flex-direction:column;
	justify-content:center;
`