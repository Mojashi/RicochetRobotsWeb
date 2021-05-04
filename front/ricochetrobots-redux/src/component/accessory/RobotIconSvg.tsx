import React from "react"
import Robot1Img from "../../img/robot1.svg"
import Robot2Img from "../../img/robot2.svg"
import Robot3Img from "../../img/robot3.svg"
import Robot4Img from "../../img/robot4.svg"
import Robot5Img from "../../img/robot5.svg"
import { Robot } from "../../model/game/Robot"

export const RobotIconSvg = ({className, rid, ...rest}:{className?:string, rid:Robot} & React.SVGProps<SVGImageElement>)=>
    <image className={className} {...rest}
     href={
        rid === 0 ? Robot1Img : 
        rid === 1 ? Robot2Img : 
        rid === 2 ? Robot3Img : 
        rid === 3 ? Robot4Img : 
        rid === 4 ? Robot5Img : Robot1Img
    }/>