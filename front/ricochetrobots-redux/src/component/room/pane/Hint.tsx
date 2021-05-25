import React from "react"

import styled from "styled-components"




import { Hands } from "../../../model/game/Hands"

import { HintCard } from "./card/HintCard"


import {Title} from "./Title"

type Props = {
	className? : string
	hint : Hands
	showHintButton : boolean,
	hintPlaying : boolean,
	onClickGetHint : ()=>void,
	onClickPlayHint : ()=>void,
	titleColor? : string,
}

export function HintView({hint,titleColor, showHintButton, hintPlaying,onClickGetHint,onClickPlayHint, className} : Props) {
	return (
		<Div className={className}>
			<TitleStyled color={titleColor}>HINT</TitleStyled>
			<HintCard hint={hint} 
				showHintButton ={showHintButton}
				selected = {hintPlaying}
				onClickGetHint={onClickGetHint}
				onClickPlay={onClickPlayHint}/>
		</Div>
	)
}

const TitleStyled = styled(Title)`
    margin-bottom:0.7em;
`

const Div = styled("div")`
	width:100%;
	height:fit-content;
`