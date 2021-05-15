import React from "react"
import styled from "styled-components"
import { PALETTE } from "../../../../app/palette"
import { ResultSubmission, Submission } from "../../../../model/game/Submission"
import { UserIcon } from "../../../accessory/UserIcon"
import { PlayIcon } from "../../../accessory/PlayIcon"
import { Chip } from "../../../menu/panel/component/Chip"
import { Card } from "./Card"
import { Hands } from "../../../../model/game/Hands"

type Props = {
    className? : string,
    hint : Hands,
    selected : boolean,
    onClick? : ()=>void,
}

export function HintCard({hint, className, selected, onClick} : Props) {
    return (
        <CardStyled className={className}
            color={PALETTE.paper}
            onClick={onClick}
            selected={selected}
        >
            <Div>
                <MovesDiv>{hint.length} moves</MovesDiv>
                <PlayIcon/>
            </Div> 
        </CardStyled>
    )
}
HintCard.defaultProps = {
    selected : false,
}

const Div = styled("div")`
    display:flex;
`
const CardStyled = styled(Card)`
    margin-top:0.7em;
    cursor: pointer;
    
    &.unique {
        &::before {
            position: absolute;
            color :#59B42E;
            border: solid #59B42E 0.2em;
            border-radius: 3px;
            font-weight: bold;
            content: "UNIQUE";
            right : -1em;
            top: 0.5em;
            transform: rotate(50deg);
        }
    }
`

const MovesDiv = styled("div")`
    white-space:nowrap;
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