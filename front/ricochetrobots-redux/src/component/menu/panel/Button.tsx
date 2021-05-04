import React from "react"
import styled from "styled-components"

interface Props {
    color : string,
    fill : string,
    text : string,
    fontSize : string,
    selected? : boolean,
    children? : React.ReactNode,
    onClick? : ()=>void,
    onHover? : ()=>void,
    className? : string,
}

export default function Button ({onClick , onHover,selected, color, fill, text, fontSize, children, className} : Props){
    return (
        <Div onClick={onClick} fontSize={fontSize} onMouseEnter={onHover} color={color} fill={fill}
         className={className + (selected ? " selected" : "")}>
            {children}
            <Text>
            {text}
            </Text>
        </Div>
    )
}

Button.defaultProps = {
    fontSize:"inherit",
}

const Div = styled("div")<{color:string, fill:string, fontSize:string}>`
    font-size:${p=>p.fontSize};
    overflow:hidden;
    width:fit-content;
    height:fit-content;
    display:flex;
    align-items:center;
    padding:0.2em 0.5em 0.2em 0.5em;
    border-radius:7px 7px 7px 7px;
    border: 2px solid ${p=>p.color};
    color:${p=>p.color};
    background-color:${p=>p.fill};
    margin: 0.3em;
    cursor:pointer;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    &:active {
        box-shadow: 0px 4px 4px 4px rgba(0, 0, 0, 0.25) inset;
    }
    &.selected {
        box-shadow: 0px 4px 4px 4px rgba(0, 0, 0, 0.25) inset;
    }
`

const Text = styled("div")`
    font-family: Roboto;
    white-space:nowrap;
`