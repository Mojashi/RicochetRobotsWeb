import React from "react"
import ArrowImg from "../../img/arrow-bone.svg"
import { Dir, DN, RT, UP } from "../../model/game/Dir"

export const ArrowIcon = ({className, dir}:{className?:string, dir:Dir})=>
	<img className={className} src={ArrowImg} alt={"arrow"+dir} draggable={false}
		style={{transform:`rotate(${
			dir === UP? "0deg":
				dir === RT? "90deg":
					dir === DN? "180deg": "270deg"
		})`}}
	/>