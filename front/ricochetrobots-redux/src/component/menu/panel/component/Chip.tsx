import React from "react"
import styled from "styled-components"

type Props = {
    fill:string,
    color:string,
    children? : React.ReactNode,
    className? : string,
}
export function Chip({fill,color,children, className} : Props){
    return (
        <Div fill={fill} color={color} className={className}>
            {children}
        </Div>
    )
}

const Div = styled("div")<{fill:string, color:string}>`
    white-space:nowrap;
    border-radius:1em;
    padding:0.2em 0.4em 0.2em 0.4em;
    background-color:${p=>p.fill};
    color:${p=>p.color};
    width:fit-content;
    margin:0.1em;
    font-weight:bold;
    font-size:0.9em;
`