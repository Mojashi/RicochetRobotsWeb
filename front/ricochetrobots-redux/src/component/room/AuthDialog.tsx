import React, { useState } from "react"
import styled from "styled-components"
import { PALETTE } from "../../app/palette"
import Button from "../menu/panel/Button"
import { Input } from "../menu/panel/component/Input"

type Props = {
    className? : string,
    onClickSend? : (password : string)=>void,
}

export function AuthDialogView({className, onClickSend} : Props) {
    const [pass, setPass] = useState<string>("")

    return (
        <Div className={className}>
            <Text>{"あいことばを入力"}</Text>
            <Input placeHolder="あいことば" onChange={(text)=>setPass(text as string)} defaultValue=""/>
            <Button text="OK" color={PALETTE.night} fill={PALETTE.white} fontSize="1.2em"
             onClick={()=>onClickSend ? onClickSend(pass) : {}}/>
        </Div>
    )
}

const Text = styled("div")`
    font-weight:bold;
    font-size: 1.2em;
`

const Div = styled("div")`
    background: ${PALETTE.night};
    width: fit-content;
    margin-left:auto;
    margin-right:auto;
    margin-top:auto;
    margin-bottom:auto;
    border-radius : 1em;
    padding : 1em;
    box-sizing:border-box;
    border: solid 2px white;
    color : white;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    display:flex;
    flex-direction:column;
    align-items:center;
`