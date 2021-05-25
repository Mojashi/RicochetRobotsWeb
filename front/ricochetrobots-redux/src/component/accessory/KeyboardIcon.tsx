import KeyBoardImg from "../../img/keyboard.svg"
import React from "react"

export const KeyboardIcon = ({className}:{className? : string})=>
	<img className={className} src={KeyBoardImg} draggable={false} alt="reset"/>
