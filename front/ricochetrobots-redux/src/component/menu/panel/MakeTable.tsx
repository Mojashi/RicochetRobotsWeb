import React, { useState } from "react"
import styled from "styled-components"
import { PALETTE } from "../../../app/palette"
import { LockIcon } from "../../accessory/LockIcon"
import Button from "./Button"
import { IconButton } from "./component/IconButton"
import { Input } from "./component/Input"
import { LinedDiv } from "./component/LinedDiv"
import { Panel } from "./Panel"
import ScrollArea from "react-scrollbar"
import { useToggle } from "../../../app/utils"



import { makeTableApi } from "../../../api/makeTable"
import { useHistory } from "react-router"
import { useImmer } from "use-immer"
import {  RoomSettings } from "../../../model/RoomInfo"

export function MakeTablePanel({className} : {className? : string}){
	const [, , ] = useToggle(false)
	const [, , ] = useToggle(false)
	const [err, setErr] = useState<string>("")
	const history = useHistory()
	const [roomSettings, updRoomSettings] = useImmer<RoomSettings>({
		name : "",
		private:false,
		password:"",
	})

	return (
		<Panel title="たくをつくる" color={PALETTE.paleGreen} className={className}>
			<Div>
				<ScrollArea style={{height:"100%", width:"fit-content"}} contentStyle={{minHeight:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}
					vertical={true} horizontal={true}>
					<LinedDiv title="設定" bgColor={PALETTE.paleGreen}>
						<Input title="たくの名前" placeHolder="テーブル" defaultValue=""
							onChange={(name)=>updRoomSettings(draft=>{draft.name=name as string})}/>
						<RowDiv>
							<IconButton title="かぎをかける" selected={roomSettings.private}
								onClick={()=>{updRoomSettings(draft=>{draft.private = !draft.private})}} fill={PALETTE.darkGreen}>
								<LockIcon open={!roomSettings.private}/>
							</IconButton>
							<Input title="あいことば" disabled={!roomSettings.private} defaultValue=""
								onChange={(password)=>updRoomSettings(draft=>{draft.password=password as string})}/>
						</RowDiv>
					</LinedDiv>
					<ErrText>{err}</ErrText>
					<ButtonDiv color={PALETTE.paleGreen} fill={PALETTE.white} text="つくる" fontSize="2em"
						onClick={()=>makeTableApi(roomSettings,(roomID)=>history.push(`/room/${roomID}`), setErr)}/>
				</ScrollArea>
			</Div>
		</Panel>
	)
}
const ErrText = styled("div")`
	font-weight:bold;
	color : red;
`
const Div = styled("div")`
	display:flex;
	flex-direction:row;
	align-items:center;
	justify-content:center;
	height:100%;
`
const RowDiv = styled("div")`
	display:flex;
	flex-direction:row;
	align-items:center;
	justify-content:space-around;
	height:100%;   
	width:fit-content;
	width:fit-content;
`

const ButtonDiv = styled(Button)`
	flex-shrink:0;
`
