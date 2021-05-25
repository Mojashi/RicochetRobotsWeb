import React from "react"
import styled, { keyframes } from "styled-components"
import { PALETTE } from "../../../../app/palette"

type Props = {
	color: string,
	indexColor:string,
	index? : number,
	children : React.ReactNode,
	className? : string,
	selected : boolean,
	onClick?: ()=>void,
}

export function Card({children, index, indexColor, color, selected, className, onClick} : Props) {
	return (
		<div style={{position:"relative"}} onClick={onClick}>
			{selected && <Stroke/>}
			<Div color={color} className={className}>
				{index!==undefined && <ChipDiv color={indexColor}>{index}</ChipDiv>}
				{children}
			</Div>
		</div>
	)
}

Card.defaultProps = {
	color : PALETTE.paper,
	indexColor : PALETTE.gold,
	selected : false,
}

const Div = styled("div")<{color:string}>`
	position:relative;
	background-color: ${p=>p.color};
	color:black;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 10px;
	padding:0.3em 0.6em 0.3em 0.6em;
	overflow:hidden;
	box-sizing:border-box;
`

const habax = "10px"
const habay = "6px"

const borderDance = keyframes`
	0% {
	  background-position: 0px 0px, calc(${habax} * 3) 100%, 0px calc(${habax} * 3), 100% 0px;
	}
	100% {
	  background-position: calc(${habax} * 3) 0px, 0px 100%, 0px 0px, 100% calc(${habax} * 3);
	}
`

const Stroke = styled("div")`
	width:100%;
	height:100%;
	left:calc(-${habay});
	top:calc(-${habay});
	position:absolute;
	pointer-events:none;

	background: linear-gradient(90deg, #F1FF51 50%, transparent 50%), linear-gradient(90deg, #F1FF51 50%, transparent 50%), linear-gradient(0deg, #F1FF51 50%, transparent 50%), linear-gradient(0deg, #F1FF51 50%, transparent 50%);
	background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
	background-size: calc(${habax} * 3) ${habay}, calc(${habax} * 3) ${habay}, ${habay} calc(${habax} * 3), ${habay} calc(${habax} * 3);
	background-position: 0px 0px, 100% 100%, 0px 100%, 100% 0px;
	padding:${habay} ${habay} ${habay} ${habay};
	animation: ${borderDance} 0.5s infinite linear;
	z-index:10;
	filter:drop-shadow(0px 0px 4px rgba(0,0,0,0.3));
`

const ChipDiv = styled("div")<{color:string}>`
	background-color: ${p=>p.color};
	position:absolute;
	width:fit-content;
	padding:0.3em 0.3em 0.1em 0.5em;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	color:"#332C05";
	border-radius: 0px 0px 10px 0px;
	box-sizing:border-box;
	font-family: Roboto;
	font-style: normal;
	font-weight: bold;
	font-size:1.2em;
	transform:translate(-0.6em, -0.5em);
`