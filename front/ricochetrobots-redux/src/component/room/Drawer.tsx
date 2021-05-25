import React, { useState } from "react"
import styled from "styled-components"
import { PALETTE } from "../../app/palette"
import {ReactComponent as Humburger} from "../../img/hamburger.svg"
type Props ={
	children? : React.ReactNode
}

export function Drawer({children} : Props) {
	const [open,setOpen] = useState(false)
	return <>
		<Div className={open?"open":""}>
			<Content>
				{children}
			</Content>
			<OpenButton onTouchEnd={()=>{setOpen(a=>!a)}}>
				<Humburger/>
			</OpenButton>
		</Div>

		<FillDiv className={open?"":"disable"} onClick={()=>setOpen(false)}/>
	</>
}
const FillDiv = styled("div")`
	position:fixed;
	width:100vw;
	height:100vh;
	left:0;
	top:0;
	background:rgba(0,0,0,0.25);
	z-index:100000;
	&.disable{
		display:none;
	}
`
const Content = styled("div")`
	position:relative;
	height: 100%;
	background: ${PALETTE.night};
	padding:2em;
	border-radius: 0 0 7em 0;
	z-index:10;
`
const OpenButton = styled("div")`
	position: absolute;
	right:0;
	transform: translateX(100%);
	top:0;
	background: ${PALETTE.night};
	color:white;
	border-radius: 0 0 0.5em 0;
	display:flex;
	padding: 0.5em;
	box-shadow: 0px 4px 2px rgba(0, 0, 0, 0.25);
	z-index:10;
`
const Div = styled("div")`
	position:absolute;
	left:0;
	top:0;
	height: 100%;
	transform: translateX(-100%);
	z-index:10000000;
	color:white;
	&.open{
		transform: translateX(0);
	}
	transition: all 0.2s;
	/* filter: drop-shadow(0 0 0.75rem rgba(0,0,0,0.7)); */
	/* box-shadow: 4px 0 10px rgba(0,0,0,0.7); */
`