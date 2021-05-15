import React from "react"
import LockImg from "../../img/lock.svg"
import LockOpenImg from "../../img/lockopen.svg"

export const LockIcon = ({className,open}:{className?:string,open:boolean})=>
    <img className={className} src={open?LockOpenImg:LockImg} draggable={false} alt="lock"/>