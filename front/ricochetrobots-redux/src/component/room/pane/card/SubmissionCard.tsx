import React from "react"
import styled from "styled-components"
import { PALETTE } from "../../../../app/palette"
import { Submission } from "../../../../model/game/Submission"
import { UserIcon } from "../../../../model/UserIcon"
import { Card } from "./Card"

type Props = {
    className? : string,
    sub : Submission,
    rank : number,
}

export function SubmissionCard({sub, rank, className} : Props) {
    return (
        <CardStyled index={rank} className={className}
            color={sub.optimal?PALETTE.gold:PALETTE.paper}
        >
            <MovesDiv>{sub.length} moves</MovesDiv>
            <AuthorDiv>
                <UserIconStyled/>{sub.user.name}
            </AuthorDiv>
        </CardStyled>
    )
}
const CardStyled = styled(Card)`
    margin-top:0.7em;
`

const MovesDiv = styled("div")`
    font-size:1.5em;
    font-weight:bold;
    padding:0 0.7em 0 0.7em;
`
const AuthorDiv = styled("div")`
    font-size:0.9em;
    text-align:right;
    font-weight:bold;
    display:flex;
    align-items:center;
    justify-content:flex-end;
`

const UserIconStyled = styled(UserIcon)`
    height:2em;
`