import React from "react"
import SendImg from "../../img/send.svg"

export const SendIcon = ({className}:{className? : string})=><div className={className} 
	style={{backgroundImage:`url(${SendImg})`,
		backgroundRepeat:"no-repeat",
		backgroundSize:"contain",
		backgroundPosition:"center"}}/>