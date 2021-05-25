import React from "react"
import { isBrowser, isMobile } from "react-device-detect"
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
            {isBrowser&&<Title>RESULT</Title>}
            <LaneStyled dir={isMobile?"row":"col"}>
            <Cards>
                {subs.map((sub, idx) => 
                    <ResultSubmissionCard key={sub.id} sub={sub} rank={idx + 1} onClick={onClick} selected={selectedID === sub.id}/>
                )}
            </Cards>
            </LaneStyled>
        </Div>
    )
}
const LaneStyled = styled(Lane)`
    flex-grow:1;
    overflow:hidden;
`

const Div = styled("div")`
    width:100%;
    height:fit-content;
    display:flex;
    flex-direction:column;
`

const Cards = styled("div")`
    width:fit-content;
    display:flex;
    gap:0.7em;
    flex-direction:column;
    ${isMobile&& `
        flex-direction:row;
    `};
`