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

interface Props {
    room : Room,
    onGame : boolean,
    interval : boolean,
    startButton : ()=>void,
}

export function RoomView({room, onGame, interval, startButton} : Props){
    return (
        <Div>
            <HeaderStyled/>
            <Content>
            <SideDiv>
                <SideDivContent>
                <ShortestStyled/>
                {interval ? <ResultStyled/>:
                <SubmissionsStyled/>}
                </SideDivContent>
            </SideDiv>
            <CenterDiv>
                {onGame ? 
                <Problem/> : <button onClick={startButton}>START GAME</button>}
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

const ResultStyled = styled(Result) `
flex-shrink:1;
height:100%;
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