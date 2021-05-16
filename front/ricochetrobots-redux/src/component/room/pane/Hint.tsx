import React, { useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import { PALETTE } from "../../../app/palette"
import { hintPlayingSelector, playHint, stopHint } from "../../../container/GameSlice"
import { WsDispatchContext } from "../../../container/Room"
import { RequestHintMessage } from "../../../container/websocket/clientMessage/requestHintMessage"
import { Hands } from "../../../model/game/Hands"
import { Submission } from "../../../model/game/Submission"
import { HintCard } from "./card/HintCard"
import { SubmissionCard } from "./card/SubmissionCard"
import { WoodButton } from "./Input/WoodButton"
import {Title} from "./Title"

type Props = {
    className? : string
    hint : Hands
    showHintButton : boolean,
    hintPlaying : boolean,
    onClickGetHint : ()=>void,
    onClickPlayHint : ()=>void,
}

export function HintView({hint,showHintButton, hintPlaying,onClickGetHint,onClickPlayHint, className} : Props) {
    return (
        <Div className={className}>
            <Title>HINT</Title>
            <HintCard hint={hint} 
                showHintButton ={showHintButton}
                selected = {hintPlaying}
                onClickGetHint={onClickGetHint}
                onClickPlay={onClickPlayHint}/>
        </Div>
    )
}


const Div = styled("div")`
    width:100%;
    height:fit-content;
`