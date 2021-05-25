import React from "react"
//@ts-ignore
import { Illustration } from "react-zdog"
import styled from "styled-components"
import { SolidRobotIconRaw } from "./SolidRobotIconRaw"

export type RobotColor = {color : string, shadow: string}

export const BlackRobotColor = {color:"#404040",shadow:"#262626"}
export const GreenRobotColor = {color:"#1cd92f",shadow:"#048718"}
export const RedRobotColor = {color:"#ff1919",shadow:"#cf1717"}
export const BlueRobotColor = {color:"#0000c4",shadow:"#000066"}
export const YellowRobotColor = {color:"#d9c300",shadow:"#8a7c00"}

type Props = {
	rotate? : {x:number, y:number, z:number},
	autoRotate : boolean,
	speed : number,
	zoom:number,
	dragRotate : boolean,
	className?:string, 
	color:RobotColor,
}

export function SolidRobotIcon({className, zoom, color, dragRotate, autoRotate, rotate, speed} : Props){
	return (
		<Div draggable={dragRotate} className={className}>
			<Illustration zoom={zoom} dragRotate={dragRotate} >
				<SolidRobotIconRaw color={color.color} shadow={color.shadow} x={0} y={0} speed={autoRotate?speed:0} rotate={rotate}/>
			</Illustration>
		</Div>
	)
}

SolidRobotIcon.defaultProps = {
	dragRotate : false,
	speed:0.01,
	autoRotate:true,
	zoom:3,
}

const Div=styled("div")<{draggable : boolean}>`
	${p=>p.draggable ? "":
		"pointer-events:none;"}
`