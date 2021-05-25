import React from "react"
import styled from "styled-components"

type Props = {
	title?: string,
	selected: boolean,
	onClick? : ()=>void,
	fill? : string,
	children?: React.ReactNode,
	className?: string,
}

export function IconButton({title, selected, fill, onClick, children, className} : Props){
	return (
		<Div className={className + (selected?" selected" : "")} onClick={onClick} fill={fill}>
			<Icon>{children}</Icon>
			<Title>{title}</Title>
		</Div>
	)
}

const Div = styled("div")<{fill?:string}>`
	width:fit-content;
	height:fit-content;
	padding:0.7em;
	border-radius: 15px;
	display:flex;
	flex-direction:column;
	align-items:center;
	background-color: ${p=>p.fill};
	cursor: pointer;

	box-shadow: 0 4px 4px rgba(0,0,0,0.25);

	&.selected{
		box-shadow: 0 4px 4px rgba(0,0,0,0.25) inset;
	}
`

const Icon = styled("div")`
	margin:0.2em;
`

const Title = styled("div")`
	text-align:center;
	font-weight:bold;
`