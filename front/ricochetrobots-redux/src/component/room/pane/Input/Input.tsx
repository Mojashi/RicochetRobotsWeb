import React from "react"
import styled from "styled-components"
import { Hands } from "../../../../model/game/Hands"
import { ResetIcon } from "../../../accessory/ResetIcon"
import { SendIcon } from "../../../accessory/SendIcon"
import { HandCard } from "../card/HandCard"
import { Lane } from "../Lane"
import { WoodButton } from "./WoodButton"

type Props = {
    hands : Hands,
    className? : string,
    onReset : ()=>void,
    onSubmit : ()=>void,
}

export function InputView({hands,onReset,onSubmit, className} : Props) {
    return (
        <Div className = {className}>
            <ButtonDiv>
                <WoodButtonStyled onClick={onSubmit}><SendIconStyled/></WoodButtonStyled>
                <WoodButtonStyled onClick={onReset}><ResetIconStyled/></WoodButtonStyled>
            </ButtonDiv>
            <LaneStyled>
                {hands.slice().reverse().map((hand, idx) => 
                    <HandCard hand={hand} idx={hands.length - idx} key={hands.length-idx} selected={idx === 0}/>
                )}
            </LaneStyled>
        </Div>
    )
}
const ResetIconStyled = styled(ResetIcon)`
    height:100%;
`
const SendIconStyled = styled(SendIcon)`
    height:100%;
`
const ButtonDiv = styled("div")`
    width:100%;
    height:3em;
    display:flex;
    margin-bottom:0.3em;
`
const WoodButtonStyled = styled(WoodButton)`
    display:inline-block;
    margin: 0 0.2em 0 0.2em;
    flex-grow:1;
`

const Div = styled("div")`
    width:100%;
    height:9.3em;
`
const LaneStyled = styled(Lane)`
    height:6em;
`