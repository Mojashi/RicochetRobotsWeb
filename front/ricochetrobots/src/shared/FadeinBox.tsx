import styled from "styled-components"
import React, { useRef } from "react"

interface Props {
    children:React.ReactNode,
    show:boolean,
    style?:any,
}

const RootDiv = styled("div")<{show:boolean}>`
    height:${p=>p.show ? "100%" : "0%"};
    transition:height 2s;
`

export default function FadeinBox(props:Props) {
    const {show, children, ...other} = props
    
    return (
        <RootDiv show={show} {...other}>
            {children}
        </RootDiv>
    )
}