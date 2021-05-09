import React from "react"
import PlayImg from "../../img/play.svg"

export const PlayIcon = ({className}:{className? : string})=>
    <img className={className} src={PlayImg} alt="play" draggable={false}/>