import React from "react"
import styled from "styled-components"
import { PALETTE } from "../../../app/palette"
import { EmptyBoard } from "../../../model/game/board/Board"
import { Pos } from "../../../model/game/Pos"
import { Problem } from "../../../model/game/Problem"
import { RobotIconSvg } from "../../accessory/RobotIconSvg"
import {BoardView} from "./Board"

type Props = {
    className? : string,
    problem : Problem,
    robotPoss : Pos[],
    selectedRobot : boolean[],
}

export function ProblemView({problem, robotPoss, selectedRobot, className} : Props) {
    return (
        <Div className={className} viewBox={"0 0 160 160"}>
            <BoardView board={problem ? problem.board : EmptyBoard}/>
            {robotPoss.map((r,idx) =>
                <RobotIconStyled rid={idx} key={idx} 
                 width={selectedRobot[idx]?12:10} 
                 height={selectedRobot[idx]?12:10} 
                 x={r.x*10} 
                 y={r.y*10}
                 transform={selectedRobot[idx]?`translate(-1, -1)`:``}/>
            )}
            <RobotIconStyled rid={problem.mainRobot} 
                 width={10} 
                 height={10} 
                 x={7.5*10} 
                 y={7.5*10}/>
        </Div>
    )
}
const RobotIconStyled = styled(RobotIconSvg)`
    transition:x 0.1s, y 0.1s;
`

const Div = styled("svg")`
    position:relative;
    height:100%;
    width:100%;
`