import React from "react"
import styled from "styled-components"
import { PALETTE } from "../../app/palette"
import { GameConfig } from "../../model/game/GameConfig"

type Props = {
	gameConfig : GameConfig
	className? : string
}

export function GameConfigDispView({gameConfig } : Props){
	return <Div>
		{gameConfig.goalPoint}点先取
	</Div>
}

const Div = styled("div")`
	font-weight:bold;
	color :${PALETTE.wood};
	border: solid ${PALETTE.wood};
	border-radius:3px;
	padding: 0.5em;
	margin-left: 1em;
`