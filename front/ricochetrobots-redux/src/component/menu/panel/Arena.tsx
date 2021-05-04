import React from "react"
import { useHistory } from "react-router"
import styled from "styled-components"
import { PALETTE } from "../../../app/palette"
import Button from "./Button"
import { LinedDiv } from "./component/LinedDiv"
import { Panel } from "./Panel"

export function ArenaPanel({className} : {className? : string}){
    const history = useHistory()
    const join = ()=>{history.push("/room/0")}

    return (
        <Panel title="アリーナ" color={PALETTE.paleBlue} className={className}>
            <Div>
                <Div2>
                    <Aori>無限人でバトル！</Aori>
                    <Button color={PALETTE.paleBlue} fill={PALETTE.white} text="はいる" fontSize="2em"
                        onClick={join} />
                </Div2>
            <LinedDiv title="こんしゅうのランキング" bgColor={PALETTE.paleBlue}>
                1st oreha_senpai 28 wins!
            </LinedDiv>
            </Div>
        </Panel>
    )
}

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