import { Hand } from "../game/hand"
import User from "./user"
import styled, { keyframes } from "styled-components"
import { useRecoilValue } from "recoil"
import { userState } from "../recoil_states"
import { useEffect, useRef, useState } from "react"
import { CSSTransition } from "react-transition-group"
import { compSub } from "../util"
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { FitSvgIcon, SvgIconButton } from "./useful"
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import SvgIcon from "@material-ui/icons/PlayArrow"
import StopIcon from '@material-ui/icons/Stop';

export interface SubmissionModel {
    id:number
    hands : Hand[]
    user : User
    date : Date
    opt : Boolean
}

/* transform: translateY(${t}) translateX(${0}px); */

const shine = keyframes`
  0% {
    transform: scale(0) rotate(45deg);
    opacity: 0;
  }
  80%{ 
    transform: scale(0) rotate(45deg);
    opacity: 0.5;
  }
  81%{ 
    transform: scale(4) rotate(45deg);
    opacity: 1;
  }
  100%{ 
    transform: scale(50) rotate(45deg);
    opacity: 0;
  }
`

const ResBox = styled('div')<{opt:Boolean}>`
    /* padding: 12px 12px 12px 5px; */
    padding:0.6ex 1ex 0.8ex 0.6ex;
    font-weight: bold;
    /* border: inset 4px #a4c7cc;*/
    border-radius:7px;
    background-color: ${p=>p.opt?"gold":"floralwhite"}; 
    color: black;
    text-shadow: 0 0 1px black;
    box-shadow: 1px 1px 4px #8c6d55;
    -webkit-text-decoration: none;
    text-decoration: none;
    display:grid;
    grid-template-rows: 6fr 4fr;
    grid-template-columns: 6fr 4fr;
    overflow:hidden;
    z-index:10;
    /* position:absolute; */
    min-height:fit-content;
    height:fit-content;
    width:100%;
    box-sizing:border-box;
    position:relative;
    white-space:nowrap;
    
    &::before{ 
        content: '';
        width: 1em;
        height: 100%;
        background-color: #fff;
        animation: ${p=>p.opt ? shine : ""}  3s ease-in-out infinite;
        position: absolute;
        left: 0;
        top:-180;
        opacity: 0;
        transform: rotate(45deg);
    }
`

const MainBox = styled.div`
    text-align:center;
    font-size:1.2rem;
    grid-column:1;
    grid-row:1;
`
const NameText = styled.div`
    text-align:right;
    font-size:small;
    grid-column:1/3;
    grid-row:2;
`

const RankBox = styled.div`
    grid-column:1;
    grid-row-start:1;
    grid-row-end:2;
    display:flex;
    align-items:center;
    flex-direction:vertical;
    font-size:1.2rem;
    /* color:#434fa9; */
    width:100%;
`

interface Props {
  sub:SubmissionModel,
  playable:boolean,
  playing:boolean,
  onPlay:()=>void,
}

export default function Submission(props : Props) {
    const {sub, playable, playing,onPlay} = props

    return (
        <ResBox opt={sub.opt}>
            {/* {rank!==undefined&&<RankBox><div style={{marginLeft:"auto", marginRight:"auto"}}>{(rank + 1).toString()}</div></RankBox>} */}
            <MainBox>{sub.hands.length.toString().padStart(2," ") +" moves"} </MainBox>
            {playable &&
            <div style={{gridRow:1, gridColumn:2,fontSize:"x-large", display:"flex", flexDirection:"column", alignSelf:"center", marginLeft:"auto",color:"green"}}>
              <SvgIconButton onClick={playable ? onPlay : ()=>{}} selected={playing} fontSize={"inherit"} component={PlayCircleOutlineIcon} sComponent={StopIcon}/>
            </div>}
            <NameText>{`by ${sub.user.name}`}</NameText>
        </ResBox>
    )
}

Submission.defaultProps = {
  playable:false,
  playing:false,
  onPlay:()=>{},
}