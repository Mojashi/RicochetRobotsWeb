import React from "react"
import styled from "styled-components"
import { PALETTE } from "../../../app/palette"
import { EmptyBoard } from "../../../model/game/board/Board"
import { Pos } from "../../../model/game/Pos"
import { Problem } from "../../../model/game/Problem"
import { RobotIconSvg } from "../../accessory/RobotIconSvg"
import {BoardView} from "./Board"
import { AnimPath, SvgAnim } from "./SvgAnim"

type Props = {
    className? : string,
    problem : Problem,
    robotPaths : AnimPath[],
    selectedRobot : boolean[],
    onTransitionEnd? : ()=>void,
}

export function ProblemView({problem, robotPaths, selectedRobot, className, onTransitionEnd} : Props) {
    return (
        <Div className={className} viewBox={"0 0 160 160"}>
            <BoardView board={problem ? problem.board : EmptyBoard}/>
            {robotPaths.map((paths,idx) =>
                <RobotIconSvg rid={idx}
                    width={selectedRobot[idx]?12:10} 
                    height={selectedRobot[idx]?12:10}
                    transform={selectedRobot[idx]?`translate(-1, -1)`:``}
                >
                    <SvgAnim key={idx} 
                     cellSize={10}
                     paths={paths}
                     onAnimEnd={onTransitionEnd}
                    />
                </RobotIconSvg>
            )}
            <RobotIconStyled rid={problem.mainRobot} 
                 width={18} 
                 height={18} 
                 x={7.5*10 - 4} 
                 y={7.5*10 - 4}/>
        </Div>
    )
}
const RobotIconStyled = styled(RobotIconSvg)`
    transition:x 0.1s, y 0.1s;
`

const Div = styled("svg")`
    box-shadow: 0 0 0.5em;
    position:relative;
    height:100%;
    width:100%;
`