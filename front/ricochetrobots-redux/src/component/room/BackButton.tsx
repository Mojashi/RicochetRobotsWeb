import React, { useState } from "react"
import styled from "styled-components"
import { PALETTE } from "../../app/palette"

type Props = {
	disable : boolean,
	onClick? : ()=>void,
	className? : string,
}


export function BackButton({className, disable, onClick} : Props) {
	const [pushed, setPushed] = useState(false)

	return (
		<Div className={className + (disable ? " disable":"") + (pushed ? " pushed":"")} 
			onClick={onClick} onMouseDown={()=>setPushed(true)} onMouseUp={()=>setPushed(false)}
			onMouseLeave={()=>setPushed(false)}>
			もどる
		</Div>
	)
}

BackButton.defaultProps = {
	disable:false
}

const Div = styled("div")`
	background-color:${PALETTE.night};
	color:${PALETTE.white};
	font-weight:bold;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 0px 100px 100px 0px;
	padding:0.3em 1.5em 0.3em 1.5em;
	height:fit-content;
	font-size:1.5em;
	cursor: pointer;

	&.disable {

	}
	&.pushed {
		padding-left:2.0em;
		margin-right:-0.5em;
	}
	transition:all 0.1s;
`