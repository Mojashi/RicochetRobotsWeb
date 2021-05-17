import React from "react"
import { useHistory } from "react-router"
import styled from "styled-components"
import { PALETTE } from "../../../app/palette"
import { User } from "../../../model/User"
import Button from "./Button"
import { LinedDiv } from "./component/LinedDiv"
import { Panel } from "./Panel"

type Props = {
    className? : string,
    ranking : User[]
    onClickJoin : ()=>void
}

export function ArenaPanelView({className,onClickJoin, ranking} : Props){
    return (
        <Panel title="アリーナ" color={PALETTE.paleBlue} className={className}>
            <Div>
                <Div2>
                    <Aori>無限人でバトル！</Aori>
                    <Button color={PALETTE.paleBlue} fill={PALETTE.white} text="はいる" fontSize="2em"
                        onClick={onClickJoin} />
                </Div2>
            <LinedDiv title="アリーナ勝ち数ランキング" bgColor={PALETTE.paleBlue}>
                {ranking.map((user,idx)=>
                    <RankDiv>{`${idx + 1}th ${user.name} ${user.arenaWinCount}wins`}</RankDiv>
                )}
            </LinedDiv>
            </Div>
        </Panel>
    )
}

const RankDiv = styled("div")`
`
const Div = styled("div")`
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:space-around;
    height:100%;   
`

const Div2 = styled("div")`
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:space-around;
    
`



const Aori = styled("div")`
    font-size:2em;
`