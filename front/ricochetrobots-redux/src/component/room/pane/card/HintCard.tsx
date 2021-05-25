import React from "react"
import styled from "styled-components"
import { PALETTE } from "../../../../app/palette"

import { PlayIcon } from "../../../accessory/PlayIcon"

import { Card } from "./Card"
import { Hands } from "../../../../model/game/Hands"
import { WoodButton } from "../Input/WoodButton"

type Props = {
	className? : string,
	hint : Hands,
	selected : boolean,
	showHintButton : boolean,
	onClickPlay : ()=>void,
	onClickGetHint : ()=>void
}

export function HintCard({hint, className, selected, showHintButton, onClickPlay, onClickGetHint} : Props) {
	return (
		<CardStyled className={className}
			color={PALETTE.paper}
			onClick={onClickPlay}
			selected={selected}
		>
			<Div>
				{hint.length > 0 &&
				<> 
					<MovesDiv>{hint.length} moves</MovesDiv>
					<PlayIcon/>
				</>
				}
			</Div> 
			{showHintButton &&
				<WoodButtonStyled onClick={()=>{onClickGetHint()}}><BText>ヒントをもらう</BText></WoodButtonStyled>
			}
		</CardStyled>
	)
}
HintCard.defaultProps = {
	selected : false,
}


const BText = styled("div")`
	color : black;
	font-weight:bold;
`
const WoodButtonStyled = styled(WoodButton)`
	border-color:${PALETTE.gold};
	background-color:${PALETTE.gold};
	width: fit-content;
	margin-right: auto;
	margin-left: auto;
`
const Div = styled("div")`
	display:flex;
`
const CardStyled = styled(Card)`
	margin-top:0.7em;
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