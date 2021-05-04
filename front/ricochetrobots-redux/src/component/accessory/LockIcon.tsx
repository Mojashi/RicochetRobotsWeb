import React from "react"
import LockImg from "../../img/lock.svg"
import LockOpenImg from "../../img/lockopen.svg"

export const LockIcon = ({open}:{open:boolean})=><img src={open?LockOpenImg:LockImg} draggable={false} alt="lock"/>