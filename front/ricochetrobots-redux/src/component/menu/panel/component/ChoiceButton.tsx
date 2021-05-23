import React, { useState } from "react"
import styled from "styled-components"
import { Chip } from "./Chip"

type Props = {
    fill:string,
    selectedFill: string,
    color:string,
    choices:string[],
    defaultChoice: number,
    onClick: (idx:number)=>void,
    className?: string,
    disabled: boolean,
    chidred? : React.ReactNode,
}
export function ChoiceButton({fill,selectedFill, choices, defaultChoice, color,onClick, className, disabled} : Props){
    const [choice, setChoice] = useState<number>(defaultChoice)
    return (
        <Div className={className}>
            {choices.map((c,idx)=>
                <Choice fill={fill} color={color} selectedFill={selectedFill} className={choice===idx?"selected":""}
                onClick={disabled ? undefined : ()=>{
                    setChoice(idx)
                    onClick(idx)
                }}> 
                    {c} 
                </Choice>
            )}
        </Div>
    )
}
ChoiceButton.defaultProps = {
    disabled : false,
}

const Choice = styled("div")<{fill:string, selectedFill:string, color:string}>`
    font-weight:bold;
    color:${p=>p.color};
    background-color:${p=>p.fill};
    box-sizing:border-box;
    padding:0.5em;
    border-right:solid 2px;
    &:last-child{
        border-right:none;
    }
    &.selected{ 
        background-color:${p=>p.selectedFill};
        box-shadow: 0 4px 4px 4px rgba(0,0,0,0.25) inset;
    }
    cursor:pointer;
`
const Div = styled("div")`
    box-shadow: 0 4px 4px rgba(0,0,0,0.25);
    overflow:hidden;
    display:flex;
    border:solid 2px;
    border-radius:1em;
    &.disabled {
        opacity : 0.4;
        cursor: default;
    }
`