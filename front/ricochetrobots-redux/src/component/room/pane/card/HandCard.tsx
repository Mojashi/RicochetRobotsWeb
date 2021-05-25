import React from "react"
import styled from "styled-components"
import { Hand } from "../../../../model/game/Hand"
import { ArrowIcon } from "../../../accessory/ArrowIcon"
import { RobotIcon } from "../../../accessory/RobotIcon"
import { Card } from "./Card"

type Props = {
	className? : string,
	hand : Hand,
	idx : number,
	selected : boolean,
}

export function HandCard({idx, hand,selected, className} : Props) {
	return (
		<CardStyled index={idx} selected={selected} className={className}>
			<Div>
				<DirDiv><RobotIconStyled id={hand.robot}/></DirDiv>
				<RobotDiv><ArrowIconStyled dir={hand.dir}/></RobotDiv>
			</Div>
		</CardStyled>
	)
}
HandCard.defaultProps = {
	selected : false,
}

const Div = styled("div")`
	height:3em;
	display:flex;
	justify-content:space-evenly;
`
const RobotIconStyled = styled(RobotIcon)`
	height:100%;
`
const ArrowIconStyled = styled(ArrowIcon)`
	height:100%;
`
const CardStyled = styled(Card)`
	margin-top:0.5em;
`
const DirDiv = styled("div")`
	height:100%;
`
const RobotDiv = styled("div")`
	height:100%;
`
