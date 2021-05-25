import React, { useState } from "react"
import styled from "styled-components"


interface Props {
	fill:string,
	children? : React.ReactNode,
	onClick? : ()=>void,
	className? : string,
}

export default function Button ({onClick,fill, className, children} : Props){
	const [pushed, setPushed] = useState(false)

	return (
		<Div fill={fill} onTouchStart={()=>setPushed(true)} onTouchCancel={()=>setPushed(false)} 
			onTouchEnd={()=>{setPushed(false);onClick&&onClick()}}
			className={(className?className:"") + (pushed ? " pushed" : "")}>
			<Text>
				{children}
			</Text>
		</Div>
	)
}

const Div = styled("div")<{fill:string}>`
	position:relative;
	flex: 1 1 0px;
	overflow-wrap:anyware;
	display:flex;
	align-items:center;
	justify-content:center;

	height:100%;
	background:${p=>p.fill};
	/* border-radius:5px 5px 0 0; */
	/* border: 2px solid white; */
	color:white;
	font-weight:bold;
	box-sizing:border-box;
	box-shadow: 0px -3px 4px rgba(255, 255, 255, 0.25);

	&.pushed{
		height:6em;
	}
	transition:all 0.2s;
`

const Text = styled("div")`
	font-family: Roboto;
	font-weight:bold;
	padding:0.2em;
	margin-top:auto;
	margin-bottom:auto;
	white-space:wrap;
	z-index:10;
`