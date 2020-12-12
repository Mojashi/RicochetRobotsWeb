
import styled from "styled-components"
import {Color, Pos, robotColor, robotImg} from "../util"

export interface RobotModel{
    pos : Pos
    idx : number
}


const RobotImg = styled("img")<{cellSize:number, x:number, y:number}>`
     position:absolute;
     transition: transform 1s;
     width:${p=>p.cellSize}px;
     height:${p=>p.cellSize}px;
     top:0px;
     left:0px;  
     transform:translate(${p=>p.x}%,${p=>p.y}%);
`
export default function Robot(props: {robot:RobotModel, cellSize:number}){
    const {robot, cellSize} = props
    const pos = robot.pos;
    return (
        <RobotImg cellSize={cellSize} x={pos.x*100} y={pos.y*100} src={robotImg(robotColor(robot.idx))}/>
    )
}
