import React from "react"
import SendImg from "../../img/send.svg"

export const SendIcon = ({className}:{className? : string})=>
    <img className={className} src={SendImg} alt="send" draggable={false}/>