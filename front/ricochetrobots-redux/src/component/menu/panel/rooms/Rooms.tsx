import React, { useState } from "react"
import styled from "styled-components"
import { PALETTE } from "../../../../app/palette"

import { Panel } from "../Panel"
import { RoomChip } from "./RoomChip"

import Button from "../Button"

import ScrollArea from "react-scrollbar"
import { RoomAbstract } from "../../../../model/RoomInfo"
import { useHistory } from "react-router"

import { RefreshIcon } from "../../../accessory/RefleshIcon"

type Props ={
	rooms : RoomAbstract[],
	onClickReload : ()=>void,
	className? : string,
}

export function RoomsPanelView({className,onClickReload, rooms} : Props){
	const [showProg, setShowProg, ] = useState(false)
	const [showWait, setShowWait, ] = useState(false)
	const [showPrivate, setShowPrivate, ] = useState(true)
	const history = useHistory()

	return (
		<Panel title={<>
			{"だれかと"}
			<RefreshIconStyled onClick={onClickReload}/>
		</>} color={PALETTE.darkBlue} className={className}>
			<InnerDiv>
				<ScrollArea horizontal={false} vertical={true}>
					<Header>
						{/* <SearchBox placeHolder="🔎ルーム名" defaultValue=""/ */}
						<Button color={PALETTE.darkBlue} fill={PALETTE.white} text="鍵付きを除く" onClick={()=>{setShowPrivate(a=>!a)}} selected={!showPrivate}/>
						<Button color={PALETTE.darkBlue} fill={PALETTE.white} text="ゲーム中のみ" onClick={()=>{setShowWait(false);setShowProg(a=>!a)}} selected={showProg}/>
						<Button color={PALETTE.darkBlue} fill={PALETTE.white} text="待機中のみ" onClick={()=>{setShowWait(a=>!a);setShowProg(false)}} selected={showWait}/>
					</Header>
					<Div>
						{rooms.filter(room=>!((room.private && !showPrivate) || (room.onGame && showWait) || (!room.onGame && showProg)))
							.map(room => <RoomChip onClickEnter={(id)=>history.push(`/room/${id}`)} key={room.id} room={room} fill={PALETTE.paleBlue} color={PALETTE.white}/>)}
					</Div>
				</ScrollArea>
			</InnerDiv>
		</Panel>
	)
}
const RefreshIconStyled = styled(RefreshIcon)`
	cursor:pointer;
	height:1em;
	width:1em;
`
const Div = styled("div")`
	display:flex;
	flex-wrap:wrap;
	justify-content:flex-start;
	align-items:flex-start;
	height:100%;   
	width:100%;
`
const InnerDiv = styled("div")`
	display:flex;
	flex-direction:column;
	height:100%;
`

const Header = styled("div")`
	display:flex;
	flex-direction:row;
	align-items:center;
	flex-wrap:wrap;
	justify-content:center; 
`