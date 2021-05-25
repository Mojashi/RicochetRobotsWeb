import React from "react"
import styled from "styled-components"
import Board from "../../../model/game/board/Board"
import CellImg from "../../../img/cell.svg"
import { CellView } from "./Cell"

type Props = {
	className? : string,
	board : Board,
}

export function BoardView({board } : Props) {
	return (
		<>
			<defs>
				<BackGround>
					<image href={CellImg} width={10} height={10}/>
				</BackGround>
			</defs>
			<rect x="0" y="0" width="100%" height="100%" fill="url(#background)"/>
			{board.cells.map((row, y)=>row.map((cell,x) => 
				<CellView cell={cell} x={x*10} y={y*10} key={x+"-"+y}/>
			))}
		</>
	)
}

const BackGround = styled("pattern").attrs({
	width:"10",
	height:"10",
	patternUnits:"userSpaceOnUse",
	id:"background",
})``