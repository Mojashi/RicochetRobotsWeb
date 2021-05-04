import React from "react"
import styled from "styled-components"

type Props = {
    title : string,
    children? : React.ReactNode,
    bgColor : string
}

export function LinedDiv({title, children, bgColor} : Props){
    return (
        <Div>
            <Title bgColor={bgColor}>{title}</Title>
            <Content>{children}</Content>
        </Div>
    )
}

const DivPadding = "1em";

const Title = styled("div")<{bgColor:string}>`
    width:fit-content;
    font-weight:bold;
    font-size:1.2em;
    transform:translateY(calc(-${DivPadding} - 50%));
    background-color:${p=>p.bgColor};
    padding: 0 1em 0 1em;
    margin:0 auto 0 auto;
`

const Content = styled("div")`
    transform:translateY(calc(-${DivPadding}));
`

const Div = styled("div")`
    margin:1em 1em 2em 1em;
    border: 2px solid #ffffff;
    border-radius: 10px;
    padding: ${DivPadding};
    width:fit-content;
`