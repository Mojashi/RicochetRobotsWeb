import AnonIcon from "../img/anonymous.png"
import React from "react"

export const UserIcon = ({className,src}:{className?:string, src?:string})=> 
    <img className={className} src={src ?src : AnonIcon} alt="icon"/>