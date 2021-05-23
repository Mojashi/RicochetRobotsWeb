import React, { useState } from "react"
import styled from "styled-components"
import { PALETTE } from "../../../app/palette"
import Button from "./Button"
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

type SECTION = "arena" | "howto" | "maketable" | "findroom" | "settings"

type Props = {}

export default function MenuView(props : Props){
    const [selected, setSelected] = useState<SECTION>("findroom");

    return (<>
        <Div>
            <PanelDiv selected={selected}/>
            <ButtonDiv selected={selected} setSelected={setSelected}/>
        </Div>
        </>
    )
}


const Div = styled("div")`
    display:flex;
    flex-wrap:nowrap;
    justify-content:space-between;
    height:100%;
    width:100%;
`

const PanelDiv = styled(PanelDivRow)`
    height:100%;
    width:60%;
`
const ButtonDiv = styled(ButtonDivRow)`
    height:100%;
    width:35%;
`

const ButtonDivRowDiv = styled("div")`
    display:flex;
    flex-wrap:nowrap;
    flex-direction:column;
    justify-content:center;
    min-width:max-content;
    margin-left:1em;
`

function ButtonDivRow({selected, setSelected, className} : {
    selected : SECTION;
    setSelected : React.Dispatch<React.SetStateAction<SECTION>>,
    className? : string;
}){
    return (
        <ButtonDivRowDiv className={className} >
            <ScrollArea horizontal={false} horizontalContainerStyle={{overflowX:"visible"}} style={{overflowX:"visible"}}>
                <Button color={PALETTE.paleBlue} text="アリーナ" selected={selected === "arena"}
                 onClick={()=>setSelected("arena")} robotColor={BlueRobotColor}/>
                <Button color={PALETTE.paleBlue} text="あそびかた" selected={selected === "howto"}
                 onClick={()=>setSelected("howto")} robotColor={RedRobotColor}/>
                <Button color={PALETTE.paleBlue} text="たくをつくる" selected={selected === "maketable"}
                 onClick={()=>setSelected("maketable")} robotColor={GreenRobotColor}/>
                <Button color={PALETTE.paleBlue} text="だれかと" selected={selected === "findroom"}
                 onClick={()=>setSelected("findroom")} robotColor={BlackRobotColor}/>
                <Button color={PALETTE.paleBlue} text="せってい" selected={selected === "settings"}
                 onClick={()=>setSelected("settings")} robotColor={YellowRobotColor}/>
            </ScrollArea>
        </ButtonDivRowDiv>
    )
}


function PanelDivRow({selected, className} : {
    selected : SECTION;
    className? : string;
}){
    return (
        <div className={className}>
            <SwitchTransition mode="out-in">
              <CSSTransition
                key={selected}
                addEndListener={(node, done) => {
                  node.addEventListener("transitionend", done, false);
                }}
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
        </div>
    )
}

const Slide = styled("div")`
    height:100%;
    &.enter{
        transform:translateX(-100%);
    }
    &.exit{
        transform:translateX(0);
    }
    &.enter-active{
        transform:translateX(0);
    }
    &.exit-active{
        transform:translateX(-100%);
    }
    &.enter-active,
    &.exit-active{
      transition: transform 150ms;
}
`