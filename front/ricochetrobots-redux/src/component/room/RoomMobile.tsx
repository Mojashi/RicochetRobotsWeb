import React, { RefObject, useEffect, useRef, useState } from "react"
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


import { AuthDialog } from "../../container/AuthDialog"
import { GameResult } from "../../container/GameResult"
import { Hint } from "../../container/Hint"
import { Drawer } from "./Drawer"
import { RobotButtons } from "../../container/RobotButtons"
import { TweetButton } from "./tweetButton"
import { BackButton } from "./BackButton"

interface Props {
	room? : RoomInfo,
	isAdmin : boolean,
	onGame : boolean,
	interval : boolean,
	readyNext : boolean,
	onNextClick : ()=>void,
	needToAuth : boolean,
}

function useMinWidth() : [RefObject<HTMLDivElement>,number] {
	const ref = useRef<HTMLDivElement>(null)
	const [size,setSize] = useState<number>(0)
	useEffect(()=>{
		const handleResize = ()=>{
		if(ref.current){
			console.log("resize")
			const rect = ref.current.getBoundingClientRect()
			setSize(Math.min(rect.width,rect.height))
		}}

		window.addEventListener("resize", handleResize);
		handleResize();
		return () => window.removeEventListener("resize", handleResize);
	},[])

	return [ref,size]
}

export function RoomViewMobile({room, onGame, interval,needToAuth, onNextClick, isAdmin,readyNext} : Props){
	const [centerRef, centerMinSize] = useMinWidth()

	const DrawerDiv = <Drawer>
		<DrawerContent>
		<BackButton/>
		{room && <TweetButton text={room?.name+"で遊ぼう！"} hashTags={["ハイパーロボット大戦"]}/>}
		<HintStyled titleColor="white"/>
		<ShortestStyled titleColor="white"/>
		<LeaderBoardStyled titleColor="white"/>
		</DrawerContent>
	</Drawer>

	const NextButton = <div style={{height:"100%"}}>
		<NextButtonStyled pushed={readyNext} onClick={onNextClick}>
			<Title style={{border:"none"}}>{onGame ? (readyNext? "WAITING":"NEXT") : "FINISH"}</Title>
		</NextButtonStyled> 
	</div>

	const CenterElem = <CenterDiv ref={centerRef}><CenterContent style={{width:`${centerMinSize}px`, height:`${centerMinSize}px`}}>
	{onGame || interval ? 
		<Problem/> : 
		isAdmin ?
			<GameSettingPanel/> :
			<Text>開始を待っています...</Text>
	}
	</CenterContent>
	</CenterDiv>

	const ContentElem = 
	<Content>
		{interval ? <ResultStyled/>:<SubmissionsStyled/>}
		{CenterElem}
		<LowerDiv><LowerContentDiv>
			<RobotDiv>
				<RobotButtonsStyled/>
			</RobotDiv>
			{interval?
				NextButton:<InputStyled/>
			}
		</LowerContentDiv></LowerDiv>
	</Content>
	

	return (<>
		<Div>
			<HeaderStyled/>
			{DrawerDiv}
			{needToAuth ? <Content><AuthDialog/></Content> : ContentElem}	   
		</Div>
		<GameResultStyled/>
	</>
	)
}

const RobotDiv = styled("div")`
	flex: 1 1 0;
	height:100%;
	top: 0;
	left:0;
`
const RobotButtonsStyled = styled(RobotButtons)`
	display:flex;
	border-radius:20%;
	border:solid 0.5em ${PALETTE.night};
	background: #E8E8E8;
	box-shadow:0 5px 5px rgba(0,0,0,0.5);
	height:100%;
	box-sizing:border-box;
`


const LowerContentDiv = styled("div")`
	display:flex;
	justify-content:space-around;
	flex-wrap:nowrap;
	height:100%;
	width:100%;
	padding:1em;
	padding-top:0;
	box-sizing:border-box;
	margin-bottom:0.5em;
`
const LowerDiv = styled("div")`
	flex: 1 0 7em;
	gap:0.5em;
	min-height:7em;
	max-height:11em;
	position:relative;
	height:100%;
	width:100%;
`

const GameResultStyled = styled(GameResult) `
	left:0;
	top:0;
	position: absolute;
	width:100%;
	height:100%;
`
const InputStyled = styled(Input)`
	flex: 1 1 0;
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
	padding-top:0.7em;
	flex: 0 0 5em;
	margin-left:1em;
	height:5em;
`
const NextButtonStyled = styled(WoodButton)`
	flex: 1 1 0;
	height:100%;
	padding:0.1em 0em 0.1em 0em;
	min-width: 0;
	display:flex;
	align-items: center;
`
const ResultStyled = styled(Result) `
	margin-top:0.7em;
	flex-shrink:0;
	padding-left:1em;
	padding-right:1em;
	height:fit-content;
	box-sizing:border-box;
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
	gap:1em;
	display:flex;
	flex-direction:column;
	align-items:flex-start;
`

const CenterContent = styled("div")`
	aspect-ratio: 1/1;
	margin:auto;
`
const centerSize = "(100vmin - 1.5em)"
const CenterDiv = styled("div")`
	display:flex;
	flex-direction:column;
	justify-content: center;
	width:100%;
	flex-shrink:1;
	flex-grow:1;
	flex-basis: calc${centerSize};
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
const DrawerContent= styled("div")`
	display: flex;
	flex-direction:column;
	gap:0.7em;
`