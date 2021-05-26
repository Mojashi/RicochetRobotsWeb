import React, { useState } from "react"
import { isMobile } from "react-device-detect"
import { useHistory } from "react-router"
import styled from "styled-components"
import { PALETTE } from "../../app/palette"

type Props = {
	disable : boolean,
	className? : string,
}


export function BackButton({className, disable} : Props) {
	const [pushed, setPushed] = useState(false)
	const history = useHistory()
	
	return (
		<Div className={className + (disable ? " disable":"") + (pushed ? " pushed":"")} 
			onClick={()=>history.push("/")} onMouseDown={()=>setPushed(true)} onMouseUp={()=>setPushed(false)}
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

	${isMobile?`
		border-radius:100px;
		border:solid 3px ${PALETTE.white};
	`:``}

	&.disable {

	}
	&.pushed {
		padding-left:2.0em;
		margin-right:-0.5em;
	}
	transition:all 0.1s;
`
