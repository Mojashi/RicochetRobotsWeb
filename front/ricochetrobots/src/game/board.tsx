import React, {useState} from 'react';
import wallImg from "../img/wall.png"
import groundImg from "../img/ground.png"
import centerImg from "../img/center.png"
import goalImg from "../img/goal.png"
import styled from "styled-components"

import Robot, {RobotModel} from "./robot"
import {Color} from "../util"
import { cast, Castable } from '@bitr/castable';


class CellModel {
    walls : [boolean, boolean, boolean, boolean]
    mirror : '/' | '\\' | undefined
    // mark: Color | undefined
    goal: boolean
    constructor (){
        this.walls = [false,false,false,false]
        this.goal = false
    }
}

export class BoardModel {
    height:number
    width: number
    cells: CellModel[][]

    constructor (width:number, height:number){
        this.width = width
        this.height = height
        this.cells = []
        for(var i:number = 0; height > i; i++){
            this.cells[i] = []
            for(var j:number = 0; width > j; j++){
                this.cells[i][j] = new CellModel();
            }
        }
    }
}


const CellObj = styled("img")<{deg?:number}>`
    alt:W;
    transform:rotate(${props => props.deg?props.deg:0}deg);
    display:relative;
    z-index:20;
    margin-top:-100%;
    height:100%;
    width:auto;
`
function Cell(props: {cell:CellModel}){
    const {cell} = props
    return (
        <div style={{width:"auto", height:"100%"}}>
            <img src={groundImg} alt="ground" height="100%" width="auto"/>
            {cell.walls[0] && cell.walls[1] && cell.walls[2] && cell.walls[3] && 
                <CellObj src={centerImg}/>
            }
            {cell.walls[0] && <CellObj deg={0} src={wallImg}/>}
            {cell.walls[1] && <CellObj deg={90} src={wallImg}/>}
            {cell.walls[2] && <CellObj deg={180} src={wallImg}/>}
            {cell.walls[3] && <CellObj deg={270} src={wallImg}/>}
            {cell.goal && <CellObj deg={0} src={goalImg}/>}
        </div>
    )
}

const Row = styled("div")<{h:number}>`
    font-size:0px;
    width:100%;
    height:calc(100%/${props=>props.h});
    display:flex;
    flex-wrap:no-wrap;
`
const Grid = styled("div")<{cellSize: number, w: number, h:number}>`
    width:${props=>props.cellSize*props.w}px;
    height:${props=>props.cellSize*props.h}px;
`

interface Props{
    board : BoardModel
    cellSize: number
    robots : RobotModel[]
    mainRobot: number
}

export default function Board(props : Props) {
    const {board, cellSize, robots, mainRobot} = props
    
    return (
        <Grid cellSize={cellSize} w={board.width} h={board.height}>
            {board.cells.map((row,idx) => {
                return <Row h={board.height} id={"row"+idx.toString()}>
                {row.map((cell,idx2) => {
                    return <Cell cell={cell}/>
                })}
                </Row>
            })}
            {
                robots.map(robot => 
                    <Robot robot={robot}  cellSize={cellSize}/>
                )
            }
            <Robot robot={{idx:mainRobot, pos:{x:board.width/2-0.5, y:board.height/2-0.5}}}  cellSize={cellSize}/>
        </Grid>
    );
}

Board.defaultProps = {
    robots : []
}
