import React from "react"
import styled from "styled-components"
import { Chip } from "./Chip"

type Props = {
	fill:string,
	selectedFill?: string,
	color:string,
	selected: boolean,
	onClick: ()=>void,
	children?: React.ReactNode,
	className?: string,
	disabled: boolean,
}
export function ChipButton({fill,selectedFill,color,selected, onClick, children, className, disabled} : Props){
	return (
		<div onClick={disabled ? undefined : onClick}>
			<ChipDiv fill={selected&&selectedFill?selectedFill:fill} color={color} className={className + (disabled?" disabled":"") + (selected?" selected":"")}>
				{children}
			</ChipDiv>
		</div>
	)
}
ChipButton.defaultProps = {
	disabled : false,
}

const ChipDiv = styled(Chip)`
	cursor:pointer;
	padding-left:0.8em;
	padding-right:0.8em;
	box-shadow: 0 4px 4px rgba(0,0,0,0.25);
	&.selected{
		box-shadow: 0 4px 4px 4px rgba(0,0,0,0.25) inset;
	}
	&.disabled {
		opacity : 0.4;
		cursor: default;
	}
`