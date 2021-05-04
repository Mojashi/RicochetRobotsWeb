import styled from "styled-components";
import React from "react"
import ScrollArea from "react-scrollbar"

type Props = {
    children? : React.ReactNode,
    className?:string,
    contentStyle?: React.CSSProperties,
}

export function Lane({children, className, contentStyle} : Props){
    return (
        <Div className={className}>
            <ScrollArea smoothScrolling={true} horizontal={false} vertical={true} style={{height:"100%"}}
                verticalScrollbarStyle={{borderRadius:"1em", background:"#854710"}}
                verticalContainerStyle={{background:"rgba(0,0,0,0)"}}>
                <Content style={contentStyle}>
                    {children}
                </Content>
            </ScrollArea>
        </Div>
    )
}
const Content = styled("div")`
    padding:0 0.8em 2em 0.8em;
`

const Div = styled("div")`
    background: rgba(0, 0, 0, 0.04);
    box-shadow: inset 0px 0px 7px rgba(0, 0, 0, 0.6);
    border-radius: 5px;
`