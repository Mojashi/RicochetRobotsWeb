import styled from "styled-components"
import React from "react"
import ScrollArea from "react-scrollbar"


type Props = {
	children? : React.ReactNode,
	className?:string,
	contentStyle?: React.CSSProperties,
	dir:"row"|"col"
}

export function Lane({children, className, contentStyle, dir} : Props){
	return (
		<Div className={className}>
			<ScrollArea smoothScrolling={true} horizontal={dir==="row"} vertical={dir==="col"} style={{height:"100%",width:"100%"}}
				verticalScrollbarStyle={{borderRadius:"1em", background:"#854710"}}
				horizontalScrollbarStyle={{borderRadius:"1em", background:"#854710"}}
				verticalContainerStyle={{background:"rgba(0,0,0,0)"}}
				contentStyle={dir==="row"?
					{width:"fit-content",height:"100%"}:
					{width:"100%",height:"fit-content"}
				}>
				<Content style={contentStyle} dir={dir}>
					{children}
				</Content>
			</ScrollArea>
		</Div>
	)
}
Lane.defaultProps={
	dir:"col"
}

const Content = styled("div")<{dir:"row"|"col"}>`
	${p=>p.dir==="col"?`
		padding: 0 0.8em 2em 0.8em;
		height: fit-content;
	`:`
		padding: 0.5em 2em 0.5em 0.5em;
		width:fit-content;
	`};
	box-sizing:border-box;
`

const Div = styled("div")`
	background: rgba(0, 0, 0, 0.04);
	box-shadow: inset 0px 0px 7px rgba(0, 0, 0, 0.6);
	border-radius: 5px;
	box-sizing:border-box;
	width:100%;
`