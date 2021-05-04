import React from "react"
import Robot1Img from "../../img/robot1.svg"
import Robot2Img from "../../img/robot2.svg"
import Robot3Img from "../../img/robot3.svg"
import Robot4Img from "../../img/robot4.svg"
import Robot5Img from "../../img/robot5.svg"
import { Robot } from "../../model/game/Robot"

export const RobotIcon = ({className, id}:{className?:string, id:Robot})=>
    <img className={className} src={
        id === 0 ? Robot1Img : 
        id === 1 ? Robot2Img : 
        id === 2 ? Robot3Img : 
        id === 3 ? Robot4Img : 
        id === 4 ? Robot5Img : Robot1Img
    } alt={"robot"+id} draggable={false} />