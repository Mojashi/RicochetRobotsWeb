import React from "react"
import styled from "styled-components"
import { OptSubSample, SubSample } from "../../model/game/Submission"
import { Room } from "../../model/Room"
import WoodImg from "../../img/wood.jpg"
import { Input } from "../../container/Input"
import { Problem } from "../../container/Problem"
import {Submissions} from "../../container/Submissions"
import { Shortest } from "../../container/Shortest"
import { LeaderBoard } from "../../container/LeaderBoard"
import { Header } from "../../container/Header"
import { ResultView } from "./pane/Result"
import { Result } from "../../container/Result"
import { WoodButton } from "./pane/Input/WoodButton"
import { PALETTE } from "../../app/palette"
import { Title } from "./pane/Title"
import { GameSettingPanel } from "../../container/GameSettingPanel"
import { RoomInfo } from "../../model/RoomInfo"
import ReactTooltip from "react-tooltip"

interface Props {
    room? : RoomInfo,
    isAdmin : boolean,
    onGame : boolean,
    interval : boolean,
    readyToNext : boolean,
    onNextClick : ()=>void,
}

export function RoomView({room, onGame, interval, onNextClick, isAdmin,readyToNext} : Props){
    return (
        <Div>
            <HeaderStyled/>
            <Content>
            <SideDiv>
                <SideDivContent>
                {interval ? <>
                    <ResultStyled/>
                    <div data-tip="親の開始を待っています">
                        <WoodButtonStyled disable={!readyToNext && onGame && !isAdmin} onClick={onNextClick}>
                            <Title style={{border:"none"}}>{onGame ? "NEXT" : "FINISH"}</Title>
                        </WoodButtonStyled> 
                    </div>
                    {(!readyToNext && onGame && !isAdmin) && <ReactTooltip place="right" type="dark" effect="float"/>}
                </>:<>
                    <ShortestStyled/>
                    <SubmissionsStyled/>
                </>}
                </SideDivContent>
            </SideDiv>
            <CenterDiv>
                {onGame || interval ? 
                <Problem/> : <GameSettingPanel/>}
            </CenterDiv>
            <SideDiv>
                <SideDivContent>
                <InputStyled/>
                <LeaderBoardStyled/>
                </SideDivContent>
            </SideDiv>
            </Content>
        </Div>
    )
}

const InputStyled = styled(Input)`
    height:9.3em;
    margin-bottom:1em;
`
const LeaderBoardStyled = styled(LeaderBoard)`
    height:calc(100% - 10.3em);
`
const ShortestStyled = styled(Shortest) `
    margin-bottom:1.5em;
    flex-shrink:0;
`
const WoodButtonStyled = styled(WoodButton)`
    padding:0.5em 0 0.5em 0;
`
const ResultStyled = styled(Result) `
flex-shrink:1;
height:100%;
margin-bottom:1em;
`
const SubmissionsStyled = styled(Submissions)`
    flex-shrink:1;
    height:100%;
`
const HeaderStyled = styled(Header)`
    height:3.5em;
`

const Div = styled("div")`
    background-image:url(${WoodImg});
    height:100%;
    width:100%;
`
const Content = styled("div")`
    overflow:hidden;
    width:100%;
    height:calc(100% - 3.5em);
    display:flex;
    align-items:center;
`

const centerSize = "(100vmin - 5.5em)"
const CenterDiv = styled("div")`
    height:calc(${centerSize});
    width:calc(${centerSize});
`
const SideDiv = styled("div")`
    width:calc(50% - ${centerSize}/2);
    height:100%;
    box-sizing:border-box;
`

const SideDivContent = styled("div")`
    box-sizing:border-box;
    margin:auto;
    padding: 0.5em;
    height:100%;
    display:flex;
    justify-content:flex-start;
    flex-direction:column;
    width:fit-content;
`