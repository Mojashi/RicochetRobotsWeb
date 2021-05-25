import React from "react"
import BackImg from "../../img/back.svg"

export const BackIcon = ({className}:{className? : string})=><div className={className} 
    style={{backgroundImage: `url(${BackImg})`,
            backgroundRepeat:"no-repeat",
            backgroundSize:"contain",
            backgroundPosition:"center"}}
/>