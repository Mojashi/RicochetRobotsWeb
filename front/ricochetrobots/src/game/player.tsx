
import styled from "styled-components"
import {Color, robotImg} from "../util"

export class PlayerModel{
    pos : [number, number]
    color: Color
    
    constructor(color:Color, pos:[number,number]){
        this.color = color
        this.pos = pos.slice() as [number, number]
    }
}


const PlayerImg = styled("img")<{cellSize:number, x:number, y:number}>`
     position:absolute;
     transition:transform 1s;
     width:${p=>p.cellSize}px;
     height:${p=>p.cellSize}px;
     top:0;
     left:0;
     transform:translate(${p=>p.x}px,${p=>p.y}px);
`
export default function Player(props: {player:PlayerModel, cellSize:number}){
    const {player, cellSize} = props
    const pos = player.pos;
    return (
        <PlayerImg cellSize={cellSize} x={pos[1]*cellSize} y={pos[0]*cellSize} src={robotImg(player.color)}/>
    )
}
