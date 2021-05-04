
import { DetailedHTMLProps } from "react";
import styled from "styled-components"
import {Color, Pos, robotColor, robotImg} from "../util"

export interface RobotModel{
    pos : Pos
    glow?: boolean
    idx : number
}

export function makeRobots(poss:Pos[]):RobotModel[]{
    return poss.map((pos, idx) => ({pos:pos, idx:idx} as RobotModel))
}


const RobotImg = styled("img")<{cellSize:number, x:number, y:number}>`
     position:absolute;
     transition: transform 0.2s linear;
     width:${p=>p.cellSize}px;
     height:${p=>p.cellSize}px;
     top:0px;
     left:0px;  
     transform:translate(${p=>p.x}%,${p=>p.y}%);
`
interface Props {
    robot:RobotModel,
    cellSize : number,
    onTransitionEnd?: ()=>void
}

export default function Robot(props : Props){
    const {robot, cellSize, onTransitionEnd} = props
    const pos = robot.pos;
    return (
        <RobotImg onTransitionEnd={onTransitionEnd} cellSize={cellSize} x={pos.x*100} y={pos.y*100} src={robotImg(robotColor(robot.idx))}/>
    )
}
