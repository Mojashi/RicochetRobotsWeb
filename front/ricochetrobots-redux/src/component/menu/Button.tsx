import React, { useState } from "react"
import styled from "styled-components"
import { RobotColor, SolidRobotIcon } from "../accessory/solidRobots/SolidRobotIcon"

interface Props {
    color : string,
    text : string,
    robotColor : RobotColor,
    children? : React.ReactNode,
    selected : boolean,
    onClick? : ()=>void,
}

export default function Button ({onClick ,color, text, robotColor, children, selected} : Props){
    const [hover, setHover] = useState(false);

    return (
        <Div onClick={onClick} onMouseEnter={()=>{setHover(true)}} onMouseLeave={()=>{setHover(false)}}
         color={color} className={selected ? "selected":""}>
            <RobotIconDiv>
                <RobotIconStyled zoom={3.5} color={robotColor} autoRotate={hover || selected} speed={selected ? 0.2 : 0.1}/>
            </RobotIconDiv>
            <Text>
            {text}
            </Text>
        </Div>
    )
}
const RobotIconStyled = styled(SolidRobotIcon)`
    height:8em;
    width:8em;
    margin-left:-1em;
    margin-top:-1em;
    overflow:visible;
    z-index:-10;
`
const RobotIconDiv = styled("div")`
    height:4em;
    width:6em;
`

const Div = styled("div")<{color:string}>`
    overflow:hidden;
    height:4.5em;
    width:calc(100% - 2em);
    border-radius:7px 0 0 7px;
    border: 2px solid ${p=>p.color};
    border-right: 0;
    color:${p=>p.color};
    font-weight:bold;
    display:flex;
    flex-direction:row;
    align-items:center;
    margin: 1em 0 1em 3em;
    box-sizing:border-box;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    cursor:pointer; 

    &.selected{
        background-color:${p=>p.color};
        color:#ffffff;
        font-weight:bold;
        font-size:1.1em;
        width:100%;
        margin-left:0;
    }
    transition:all 0.3s;
`

const Text = styled("div")`
    font-family: Roboto;
    font-size: 2em;
    margin-block-start: 0.4em;
    margin-block-end: 0.4em;
    white-space:nowrap;
    z-index:10;
`