import React from "react"
import styled from "styled-components"
import { ResultSubmission, Submission } from "../../../model/game/Submission"
import { User } from "../../../model/User"
import { LeaderBoardUserCard } from "./card/LeaderBoardUserCard"
import { ResultSubmissionCard } from "./card/ResultSubmissionCard"
import { SubmissionCard } from "./card/SubmissionCard"
import { Lane } from "./Lane"
import {Title} from "./Title"

type Props = {
    className? : string,
    subs : ResultSubmission[],
    onClick : (sub:ResultSubmission)=>void,
    selectedID? : number,
}

export function ResultView({className, subs, onClick, selectedID} : Props) {
    return (
        <Div className = {className}>
            <Title>RESULT</Title>
            <LaneStyled>
                {subs.map((sub, idx) => 
                    <ResultSubmissionCard key={sub.id} sub={sub} rank={idx + 1} onClick={onClick} selected={selectedID === sub.id}/>
                )}
            </LaneStyled>
        </Div>
    )
}
const LaneStyled = styled(Lane)`
    margin-top:0.7em;
    flex-grow:1;
    overflow:hidden;
`

const Div = styled("div")`
    width:100%;
    display:flex;
    flex-direction:column;
`