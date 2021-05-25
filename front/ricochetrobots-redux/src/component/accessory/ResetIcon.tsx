import React from "react"
import ResetImg from "../../img/reset.svg"

export const ResetIcon = ({className}:{className? : string})=><div className={className} 
	style={{backgroundImage: `url(${ResetImg})`,
		backgroundRepeat:"no-repeat",
		backgroundSize:"contain",
		backgroundPosition:"center"}}
/>