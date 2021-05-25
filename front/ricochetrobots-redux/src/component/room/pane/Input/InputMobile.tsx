import React from "react"
import styled from "styled-components"


import { Hands } from "../../../../model/game/Hands"
import { BackIcon } from "../../../accessory/BackIcon"
import { ResetIcon } from "../../../accessory/ResetIcon"
import { SendIcon } from "../../../accessory/SendIcon"


import { WoodButton } from "./WoodButton"

type Props = {
	hands : Hands,
	className? : string,
	onBack : ()=>void,
	onReset : ()=>void,
	onSubmit : ()=>void,
	disableControls : boolean,
	disableSubmit : boolean,
}

export function InputViewMobile({onReset,onBack,onSubmit,  disableControls, disableSubmit} : Props) {
	return (
		<ButtonDiv>
			<WoodButtonStyled onClick={onBack} disable={disableControls}><BackIconStyled/></WoodButtonStyled>
			<WoodButtonStyled onClick={onSubmit} disable={disableControls || disableSubmit}><SendIconStyled/></WoodButtonStyled>
			<WoodButtonStyled onClick={onReset} disable={disableControls}><ResetIconStyled/></WoodButtonStyled>
		</ButtonDiv>
	)
}

const BackIconStyled = styled(BackIcon)`
height:100%;
`
const ResetIconStyled = styled(ResetIcon)`
height:100%;
`
const SendIconStyled = styled(SendIcon)`
	height:100%;
`
const ButtonDiv = styled("div")`
	display:flex;
	flex-wrap:nowrap;
	flex-direction:column;
	justify-content:space-between;
	height:100%;
	box-sizing:border-box;
	flex: 0 0 9em;
	width:9em;
`
const WoodButtonStyled = styled(WoodButton)`
	flex: 1 1 0px;
	box-sizing:border-box;
	padding-left:2em;
	padding-right:2em;
	/* gap:1em; */
	margin-bottom: 1em;
`
