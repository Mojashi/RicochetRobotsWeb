import React from "react"
import styled from "styled-components"
import { PALETTE } from "../../../app/palette"
import { Panel } from "./Panel"

export function HowToPanel({className} : {className? : string}){
    return (
        <Panel title="あそびかた" color={PALETTE.paleRed} className={className}>
            <Div>
                <Text>
                    お調べください
                </Text>
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
const Text = styled("div")`
    font-weight:bold;
    width:fit-content;
`