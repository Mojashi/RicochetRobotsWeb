import React from "react"
import { useHistory } from "react-router"
import styled from "styled-components"
import { UserNav } from "../../container/UserNav"
import { UserNavView } from "../usernav/UserNav"
import { BackButton } from "./BackButton"

interface Props {
    className? : string,
    roomName : string,
    timeLeft?: number,
}

export function HeaderView({className,roomName, timeLeft} : Props){
    const history = useHistory();

    return (
        <Div className={className}>
            <BackButton onClick={()=>history.goBack()}/>
            <CenterText>{timeLeft ? timeLeft : roomName}</CenterText>
            <UserNav/>
        </Div>
    )
}

const CenterText = styled("div")`
    align-items:center;
    font-weight: bold;
    font-size: 1.7em;
    
    color: #9A5415;
    height:fit-content;   
    -webkit-text-stroke: 1.5px #9A5415;
    text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.25);
`

const Div = styled("div")`
    display:flex;
    justify-content:space-between;
    align-items:center;
    width:100%;
    display:flex;
    padding:0.4em 0 0.4em;
    box-sizing:border-box;
`