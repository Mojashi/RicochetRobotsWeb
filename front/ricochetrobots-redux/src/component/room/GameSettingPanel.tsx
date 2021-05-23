import React, { useState } from "react"
import styled from "styled-components"
import { PALETTE } from "../../app/palette"
import { WoodButton } from "./pane/Input/WoodButton"
import { Title } from "./pane/Title"
import { ReflectIcon } from "../accessory/ReflectIcon"
import { TorusIcon } from "../accessory/TorusIcon"
import { Input } from "../menu/panel/component/Input"
import { ChipButton } from "../menu/panel/component/ChipButton"
import { useToggle } from "../../app/utils"
import Button from "../menu/panel/Button"
import { NumInput } from "../menu/panel/component/NumInput"
import ReactTooltip from 'react-tooltip'
import ScrollArea from "react-scrollbar"
import { Choice, GameConfig, Never } from "../../model/game/GameConfig"
import {useImmer} from "use-immer"
import { FirstToWin } from "../../model/game/Rule"
import { ChoiceButton } from "../menu/panel/component/ChoiceButton"
import { Chip } from "../menu/panel/component/Chip"


type Props = {
    className? : string,
    onClickStart? : (gameConfig:GameConfig)=>void,
}

const defaultGameConfig : GameConfig = {
    rule : FirstToWin,
    timeLimit : 30,
    goalPoint : 20,
    pointForFirst : 5,
    pointForOther : 2,
    problemConfig : {
        solLenMin:1,
        solLenMax:99,
        torus : Never,
        mirror : Never,
    }
}
export function GameSettingPanelView({className,onClickStart} : Props) {
    const [reflect, toggleReflect, ] = useToggle(false)
    const [torus, toggleTorus, ] = useToggle(false)
    const [gameConfig, updGameConfig] = useImmer<GameConfig>(defaultGameConfig)

    return <Div className={className}>
        <ScrollArea style={{width:"100%", height:"100%"}} contentStyle={{minWidth:"100%", minHeight:"100%", display:"flex"}} >
            <ContentDiv>
        <LargeText>{"ルールせってい"}</LargeText>
        
        <RowDiv>
            <NumInput title="最適解後の猶予" tail={"秒"} placeHolder="10" defaultValue={defaultGameConfig.timeLimit} 
                isValid={(v)=>v>=0&&v<100} onChange={(v)=>updGameConfig(draft=>{draft.timeLimit = v as number})}/>
            <Text>{"最適解が出たあと,この"}<br/>{"秒数を待って問題を終了"}</Text>
        </RowDiv>
        <RowDiv>
            <NumInput title="最初の最適正解者に" defaultValue={defaultGameConfig.pointForFirst} tail={"pt"}
             isValid={(v)=>v>0&&v<100} onChange={(v)=>updGameConfig(draft=>{draft.pointForFirst = v as number})}/>
            <NumInput title="他の最適正解者に" defaultValue={defaultGameConfig.pointForOther} tail={"pt"} 
             isValid={(v)=>v>=0&&v<100} onChange={(v)=>updGameConfig(draft=>{draft.pointForOther = v as number})}/>
            <NumInput title="" defaultValue={defaultGameConfig.goalPoint} tail={"点先取"} 
             isValid={(v)=>v>0&&v<100} onChange={(v)=>updGameConfig(draft=>{draft.goalPoint = v as number})}/>
        </RowDiv>
        <RowDiv>
            <NumInput title="最短手数の下限" defaultValue={defaultGameConfig.problemConfig.solLenMin} tail={"手"}
                isValid={(v)=>(v>=1&& v<=gameConfig.problemConfig.solLenMax)} 
                onChange={(v)=>updGameConfig(draft=>{draft.problemConfig.solLenMin = v as number})}/>
            <NumInput title="最短手数の上限" defaultValue={defaultGameConfig.problemConfig.solLenMax} tail={"手"} 
                isValid={(v)=>(v<=99&& v>=gameConfig.problemConfig.solLenMin)} 
                onChange={(v)=>updGameConfig(draft=>{draft.problemConfig.solLenMax = v as number})}/>
        </RowDiv>

        <RowDiv data-tip="工事中です！">
            <NumInput title="ロボットの数" disabled={true} defaultValue={5} tail={"個"} isValid={(v)=>v>0}/>
            <NumInput title="ボードの幅" disabled={true} defaultValue={16} tail={"マス"} isValid={(v)=>v>0}/>
            <NumInput title="ボードの高さ" disabled={true} defaultValue={16} tail={"マス"} isValid={(v)=>v>0}/>
        </RowDiv>

        <ChoiceDiv>
            <ChoiceTitle><Icon><ReflectIcon/></Icon>はんしゃマス</ChoiceTitle>
            <ChoiceButton fill={PALETTE.lightGray} color={PALETTE.darkGray} selectedFill={PALETTE.orange} choices={["なし", "あり", "必ず"]} 
            defaultChoice={defaultGameConfig.problemConfig.mirror} onClick={(v)=>updGameConfig(draft=>{draft.problemConfig.mirror = v as Choice})}/>
        </ChoiceDiv>
        
        <ChoiceDiv>
            <ChoiceTitle><Icon><TorusIcon/></Icon>トーラス</ChoiceTitle>
            <ChoiceButton fill={PALETTE.lightGray} color={PALETTE.darkGray} selectedFill={PALETTE.orange} choices={["なし", "あり", "必ず"]} 
            defaultChoice={defaultGameConfig.problemConfig.torus} onClick={(v)=>updGameConfig(draft=>{draft.problemConfig.torus = v as Choice})}/>
        </ChoiceDiv>
        
        <ReactTooltip place="right" type="dark" effect="float"/>

        <StartButton onClick={onClickStart?()=>{onClickStart(gameConfig)}:undefined}
             color={PALETTE.night} fill={PALETTE.white} text="はじめる" fontSize="2em"/>
        </ContentDiv>
        </ScrollArea>
    </Div>
}

const Icon = styled("div")`
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    margin-right:0.5em;
    display:flex;
`

const Text = styled("div")`
    font-weight:bold;
    word-break:break-all;
    word-wrap:break-word;
    width:fit-content;
`
const ChoiceTitle = styled("div")`
    display:flex;
    flex-direction:row;
    align-items:center;
    width:fit-content;
    color:${PALETTE.darkGray};
    margin-right:1em;
`
const ChoiceDiv = styled("div")`
    display:flex;
    flex-direction:row;
    align-items:center;
    padding:0.5em;
    width:fit-content;
    border-radius:1em;
    background-color:${PALETTE.lightGray};
`
const RowDiv = styled("div")`
    display:flex;
    flex-direction:row;
    align-items:center;
    height:100%;   
    width:fit-content;
    gap:1.5em;
`
const Div = styled("div") `
    width:100%;
    height:100%;
    border : solid;
    border-radius: 3%;
    box-sizing:border-box;
    color:white;
    background : ${PALETTE.night};
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
`
const ContentDiv = styled("div")`
    gap:1.5em;
    min-width:100%;
    min-height:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:space-between;
`

const StartButton = styled(Button)`
    width:fit-content;
    margin-bottom:1em;
    padding: 0.7em 0.5em 0.7em 0.5em;
`

const LargeText = styled("h2") `
    border:none;
`