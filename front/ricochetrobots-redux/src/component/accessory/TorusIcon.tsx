import React from "react"
import Torus from "../../img/torus.svg"

export const TorusIcon = ({className}:{className?:string})=>
	<img className={className} src={Torus} alt="torus" draggable={false} />