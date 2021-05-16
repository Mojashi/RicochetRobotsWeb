import React from "react"
import { useHistory } from "react-router"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import styled from "styled-components"
import { PALETTE } from "../../app/palette"
import { GameConfig } from "../../container/GameConfigDisp"
import { Notification } from "../../container/GameSlice"
import { UserNav } from "../../container/UserNav"
import { UserNavView } from "../usernav/UserNav"
import { BackButton } from "./BackButton"

interface Props {
    className? : string,
    roomName : string,
    msgs : Notification[],
    onMsgEntered : (id : number)=>void,
}

export function HeaderView({className,roomName, msgs, onMsgEntered} : Props){
    const history = useHistory();

    return (
        <Div className={className}>
            <BackButtonStyled onClick={()=>history.push("/")}/>
            <CenterText>{roomName}</CenterText>
            <GameConfig/>
            <TransitionGroupStyled>
            {msgs.map(msg => 
                <CSSTransition key={msg.id} timeout={200} in={true} onEntering={()=>onMsgEntered(msg.id)}>
                    <MessageBox>{msg.msg}</MessageBox>
                </CSSTransition>
            )}
            </TransitionGroupStyled>
        </Div>
    )
}
const UserNavStyled = styled(UserNav)`
    z-index: 1000;
    position : absolute;
    right : 0;
    top : 50%;
    transform:translateY(-50%);
`
const BackButtonStyled = styled(BackButton) `
    position : absolute;
    left: 0;
    top : 50%;
    transform:translateY(-50%);
`

const TransitionGroupStyled = styled(TransitionGroup) `
    position : absolute;
    width : 100%;
    height : 100%;
    pointer-events:none;
`
const MessageBox = styled("div")`
    position:absolute;
    min-width : 10em;
    width:fit-content;
    height:100%;
    border: solid 2px white;
    border-top:none;
    border-radius : 0 0 1em 1em;
    padding:0.1em 1em 0.1em 1em;
    background : ${PALETTE.night};
    /* background : white; */
    box-sizing: border-box;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    top:0;
    left:50%;
    transform : translateX(-50%);
    font-weight : bold;
    font-size : 2em;
    color : white;
    margin-top:auto;
    margin-bottom:auto;

    &.enter {
        top : -100px;
    }
    &.enter-active {
        top : 0;
        transition: all 200ms;
    }
    &.exit {
        top : 0px;
    }
    &.exit-active {
        top : -100px;
        transition: all 200ms;
    }
`

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
    position:relative;
    justify-content:center;
    align-items:center;
    width:100%;
    display:flex;
    padding:0.4em 0 0.4em;
    box-sizing:border-box;
`