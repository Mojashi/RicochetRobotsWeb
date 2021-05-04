import React from "react"
import styled from "styled-components"
import { Submission } from "../../../model/game/Submission"
import { User } from "../../../model/User"
import { LeaderBoardUserCard } from "./card/LeaderBoardUserCard"
import { SubmissionCard } from "./card/SubmissionCard"
import { Lane } from "./Lane"
import {Title} from "./Title"

type Props = {
    className? : string,
    subs : Submission[],
}

export function ResultView({className, subs} : Props) {
    return (
        <Div className = {className}>
            <LaneStyled>
                {subs.map((sub, idx) => 
                    <SubmissionCard sub={sub} rank={idx + 1}/>
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