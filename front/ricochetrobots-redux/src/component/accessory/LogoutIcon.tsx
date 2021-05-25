import LogoutImg from "../../img/logout.svg"
import React from "react"

export const LogoutIcon = ({className}:{className? : string})=>
	<img className={className} src={LogoutImg} draggable={false} alt="reset"/>
