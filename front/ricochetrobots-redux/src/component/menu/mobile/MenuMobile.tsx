import React, { useState } from "react"
import styled from "styled-components"
import { PALETTE } from "../../../app/palette"
import { BlackRobotColor, BlueRobotColor, GreenRobotColor, RedRobotColor, YellowRobotColor } from "../../accessory/solidRobots/SolidRobotIcon"
import { CSSTransition, SwitchTransition } from "react-transition-group"
import { HowToPanel } from "../panel/HowTo"
import { MakeTablePanel } from "../panel/MakeTable"
import { SettingsPanel } from "../panel/Settings"
import ScrollArea from "react-scrollbar"
import { FirstToWin } from "../../../model/game/Rule"
import { RoomsPanel } from "../../../container/RoomsPanel"
import { ArenaPanel } from "../../../container/ArenaPanel"
import Helmet from "react-helmet"
import Button from "./Button"

type SECTION = "arena" | "howto" | "maketable" | "findroom" | "settings"

type Props = {}

export default function MenuViewMobile(props : Props){
    const [selected, setSelected] = useState<SECTION>("findroom");

    return <Div>
            <PanelDiv>
            <SwitchTransition mode="in-out">
              <CSSTransition
                key={selected}
                timeout={150}
              >
                  <Slide>
                    {selected === "arena" && <ArenaPanel/>}
                    {selected === "howto" && <HowToPanel/>}
                    {selected === "maketable" && <MakeTablePanel/>}
                    {selected === "findroom" && <RoomsPanel/> }
                    {selected === "settings" && <SettingsPanel/>}
                    </Slide>
                </CSSTransition>
            </SwitchTransition>
            </PanelDiv>
            <Buttons setSelected={setSelected}/>
        </Div>
}

const Slide = styled("div")`
    height:100%;
    width:100%;
    position:absolute;
    left:0;
    top:0;
    z-index:0;
    &.enter{
        left:-100%;
        z-index:1;
    }
    &.enter-active{
        left:0;
        z-index:1;
        transition: all 150ms;
    }
`
const PanelDiv = styled("div")`
    height:calc(100% - 3em);
    width:100%;
`

const Div = styled("div")`
    display:flex;
    flex-direction:column;
    flex-wrap:nowrap;
    justify-content:space-between;
    height:100%;
    width:100%;
`


function Buttons({setSelected, className} : {
    setSelected : React.Dispatch<React.SetStateAction<SECTION>>,
    className? : string;
}){
    return (
        <ButtonsDiv className={className} key="aa">
            <Button onClick={()=>setSelected("arena")} fill={PALETTE.paleBlue}>
                {"アリーナ"}
            </Button>
            <Button onClick={()=>setSelected("howto")} fill={PALETTE.paleRed}>
                {"あそびかた"}
            </Button>
            <Button onClick={()=>setSelected("maketable")} fill={PALETTE.paleGreen}>
                {"たくをつくる"}
            </Button>
            <Button onClick={()=>setSelected("findroom")} fill={PALETTE.darkBlue}>
                {"だれかと"}
            </Button>
            <Button onClick={()=>setSelected("settings")} fill={PALETTE.paleYellow}>
                {"せってい"}
            </Button>
        </ButtonsDiv>
    )
}

const ButtonsDiv = styled("div")`
    display:flex;
    align-items:flex-end;
    position:fixed;
    bottom:0;
    height:4em;
    width:100%;
    z-index:2;
`