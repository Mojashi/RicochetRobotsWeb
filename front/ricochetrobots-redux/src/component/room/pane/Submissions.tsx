import React from "react"
import styled from "styled-components"
import { Submission } from "../../../model/game/Submission"
import { SubmissionCard } from "./card/SubmissionCard"
import {Title} from "./Title"

type Props = {
    className? : string,
    subs : Submission[],
}

export function SubmissionsView({subs, className} : Props) {
    return (
        <Div className={className}>
            <Title>SUBMISSIONS</Title>
            {subs.slice(Math.max(subs.length - 5, 0), subs.length).reverse().map((sub,idx) => 
                <SubmissionCard sub={sub} key={""+idx+sub.id} rank={idx + 1}/>
            )}
        </Div>
    )
}
const Div = styled("div")`
    width:100%;
    height:fit-content;
`