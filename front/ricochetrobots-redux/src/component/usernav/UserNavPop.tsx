import React from "react"
import styled from "styled-components"
import { PALETTE } from "../../app/palette"
import { KeyboardIcon } from "../accessory/KeyboardIcon"
import { LogoutIcon } from "../accessory/LogoutIcon"
import { LoginIcon } from "../accessory/LoginIcon"

type Props = {
    className? : string,
    loggedIn : boolean,
    onClickLogIn? : ()=>void,
    onClickLogOut? : ()=>void,
    onClickSetting? : ()=>void,
}

export function UserNavPopView({className, onClickLogIn, onClickLogOut, onClickSetting, loggedIn} : Props){

    return (
        <Div className={className}>
            <Button onClick={onClickSetting}><KeyboardIconStyled/>操作の設定</Button>
            <Divider/>
            {loggedIn ? 
                <Button onClick={onClickLogOut}><LogoutIconStyled/>ログアウト</Button>:
                <Button onClick={onClickLogIn}><LoginIconStyled/>ログイン</Button>
            }
        </Div>
    )
}

const Div = styled("div")`
    background-color: ${PALETTE.night};
    position:absolute;
    box-shadow: 0px 0px 10px rgba(0,0,0,0.5);
    border:solid 2px white;
    border-radius:0.4em;
    transform:translateX(calc(3.2em - 100%));
    z-index:100;
    &::before {
        pointer-events:none;
        content: "";
        position: absolute;
        top: -24px;
        left: 50%;
        margin-left: calc(50% - 2.4em);
        border: 12px solid transparent;
        border-bottom: 12px solid ${PALETTE.night};
        z-index: 100;
    }
`
const Divider = styled("div")`
    background-color:${PALETTE.paper};
    height:2px;
`
const KeyboardIconStyled = styled(KeyboardIcon)`
    margin-right:0.5em;
    height:1em;
`
const LogoutIconStyled = styled(LogoutIcon)`
    margin-right:auto;
    margin-left:auto;
    height:1.4em;
`
const LoginIconStyled = styled(LoginIcon)`
    margin-right:auto;
    margin-left:auto;
    height:1.4em;
`
const Button = styled("div")`
    color:${PALETTE.paper};
    font-weight:bold;
    white-space:nowrap;
    padding:0.5em 1.2em 0.5em 0.7em;
    font-size:1.3em;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content: space-between;
`