import React from "react"
import styled from "styled-components"
import { PALETTE } from "../../../app/palette"
import { LockIcon } from "../../accessory/LockIcon"
import Button from "./Button"
import { IconButton } from "./component/IconButton"
import { Input } from "./component/Input"
import { LinedDiv } from "./component/LinedDiv"
import { Panel } from "./Panel"
import ScrollArea from "react-scrollbar"
import { useToggle } from "../../../app/utils"
import { ChipButton } from "./component/ChipButton"
import { ReflectIcon } from "../../accessory/ReflectIcon"
import { TorusIcon } from "../../accessory/TorusIcon"

export function MakeTablePanel({className} : {className? : string}){
    const [locked, toggleLocked, ] = useToggle(false);
    const [reflect, toggleReflect, ] = useToggle(false);
    const [torus, toggleTorus, ] = useToggle(false);

    return (
        <Panel title="たくをつくる" color={PALETTE.paleGreen} className={className}>
            <Div>
                <ScrollArea style={{height:"100%", width:"fit-content"}} vertical={true} horizontal={true}>
                <LinedDiv title="基本設定" bgColor={PALETTE.paleGreen}>
                    <Input title="たくの名前" placeHolder="テーブル１"/>
                    <Input title="さいだいの人数" placeHolder="4" defaultValue={4} type="number"/>
                    <RowDiv>
                        <IconButton title="かぎをかける" selected={locked} onClick={toggleLocked} fill={PALETTE.darkGreen}>
                        <LockIcon open={!locked}/>
                        </IconButton>
                        <Input title="あいことば" disabled={!locked}/>
                    </RowDiv>
                </LinedDiv>
                <LinedDiv title="ルール設定" bgColor={PALETTE.paleGreen}>
                    <RowDiv>
                        <Input title="正解後の待機時間" placeHolder="0" defaultValue={0} type="number"/>
                        <Text>{"最適解が出たあともその"}<br/>{"秒数を待ってゲームを終了"}</Text>
                    </RowDiv>
                    <Chips>
                        <ChipButtonStyled fill={PALETTE.lightGray} color={PALETTE.darkGray} selected={reflect} selectedFill={PALETTE.orange} onClick={toggleReflect}>
                            <RowDiv><Icon><ReflectIcon/></Icon>はんしゃマス</RowDiv>
                        </ChipButtonStyled>
                        <ChipButtonStyled fill={PALETTE.lightGray} color={PALETTE.darkGray} selected={torus} selectedFill={PALETTE.orange} onClick={toggleTorus}>
                            <RowDiv><Icon><TorusIcon/></Icon>トーラス</RowDiv>
                        </ChipButtonStyled>
                    </Chips>
                </LinedDiv>
                </ScrollArea>

                <ButtonDiv color={PALETTE.paleGreen} fill={PALETTE.white} text="つくる" fontSize="2em"/>
            </Div>
        </Panel>
    )
}

const Div = styled("div")`
    display:flex;
    flex-direction:row;
    align-items:flex-start;
    justify-content:center;
    height:100%;
`
const RowDiv = styled("div")`
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:space-around;
    height:100%;   
    width:fit-content;
    width:fit-content;
`

const ButtonDiv = styled(Button)`
    flex-shrink:0;
`

const Text = styled("div")`
    font-weight:bold;
    word-break:break-all;
    word-wrap:break-word;
    width:fit-content;
`
const Icon = styled("div")`
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    margin-right:0.5em;
    display:flex;
`
const Chips = styled("div")`
    display:flex;
    flex-wrap:wrap;
    align-items:flex-start;
    justify-content:center;
`

const ChipButtonStyled=styled(ChipButton)`
    margin-left:1em;
`