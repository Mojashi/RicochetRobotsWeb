import React from "react"
import styled from "styled-components"
import { Submission, SubSample } from "../../../model/game/Submission"
import { Card } from "./card/Card"
import { SubmissionCard } from "./card/SubmissionCard"
import {Title} from "./Title"

type Props = {
    className? : string,
    sub? : Submission,
    titleColor?:string,
}

export function ShortestView({sub,titleColor, className} : Props) {
    return (
        <Div className = {className}>
            <Title color={titleColor}>SHORTEST</Title>
            {sub ? 
                <SubmissionCard sub={sub} rank={1}/> : 
                ""
            }
        </Div>
    )
}
const Div = styled("div")`
    width:100%;
    height:fit-content;
`