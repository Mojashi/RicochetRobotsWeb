import React from "react"
import styled from "styled-components"
import { Hands } from "../../../model/game/Hands"
import { Submission } from "../../../model/game/Submission"
import { HintCard } from "./card/HintCard"
import { SubmissionCard } from "./card/SubmissionCard"
import {Title} from "./Title"

type Props = {
    className? : string
    hint : Hands
    onClick : ()=>void
}

export function HintView({hint, onClick, className} : Props) {
    return (
        <Div className={className} onClick={onClick}>
            <Title>HINT</Title>
            <HintCard hint={hint}/>
        </Div>
    )
}
const Div = styled("div")`
    width:100%;
    height:fit-content;
`