import React from "react"
import styled from "styled-components"
import { PALETTE } from "../../../app/palette"
import { Panel } from "./Panel"

export function SettingsPanel({className} : {className? : string}){
    return (
        <Panel title="せってい" color={PALETTE.paleYellow} className={className}>
        <Div>
            <Text>
                人を変えようとする前に、自分から
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