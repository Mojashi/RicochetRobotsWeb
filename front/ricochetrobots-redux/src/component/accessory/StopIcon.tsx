import React from "react"
import StopImg from "../../img/stop.svg"

export const StopIcon = ({className}:{className? : string})=>
    <img className={className} src={StopImg} alt="stop" draggable={false}/>