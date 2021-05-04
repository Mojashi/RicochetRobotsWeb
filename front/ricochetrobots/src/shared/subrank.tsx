import { Hand } from "../game/hand"
import User from "./user"
import styled, { keyframes } from "styled-components"
import { useRecoilValue } from "recoil"
import { userState } from "../recoil_states"
import { RefObject, useEffect, useRef, useState } from "react"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import { compSub } from "../util"
import Submission, {SubmissionModel} from "./submission"
import { SampleSubmission } from "../sample"
import {BurnedTitle} from "./useful"

const RankingBox = styled('div') `
    white-space: nowrap;
    width:100%;
    height:100%;
    display:flex;
    flex-direction:column;
    overflow-y:hidden;
    overflow-x:hidden;
`

    /* animation:${p=>p.animate ? (p.mine?appear(p.sx,p.sy,p.pos):appear("0", "100vh",p.pos)):""} 2s ease-in-out; */
const AnimSubmission = styled("div")<{pos:string}>`
    position:absolute;
    transform: translateY(${p=>p.pos});
    transition:transform 0.5s; 
    box-sizing:border-box;
    width:100%;
    
    z-index:10;
    /* height:8ex; */

    &.enter{
        transform: translateY(-100vh);
    }
    &.exiting{
        transform: translateY(100vh);
    }
`

const SubmissionsBox = styled("div")`
    position:relative;
    width:100%;
    height:100%;
    margin-left:auto;
    margin-right:0.5em;
`

interface Props {
    subs : SubmissionModel[],
    playable : boolean,
    playing? : number,
    onPlay : (idx:number)=>void
}

const RankDisp = styled("div")<{h:number}>`
    color: saddlebrown;
    font-weight: bolder;
    font-size: x-large;
    height:${p=>p.h*1.10}px;
    display:flex;
    flex-direction:column;
    margin-right:0.5em;
    margin-left:0.5em;
`

export default function SubRanking(props : Props){
    const {subs, playable, onPlay, playing} = props
    const sRef = useRef<HTMLDivElement>(null)
    const [sHeight,setSHeight] = useState<number>(0)
    const maxRank = 3

    useEffect(()=>{
        if(sRef.current)
            setSHeight(sRef.current?.clientHeight)
    }, [sRef.current?.clientHeight])

    return (
        <RankingBox>
        <BurnedTitle>RANKING</BurnedTitle>
        <div style={{width:"100%",height:"100%",display:"flex", flexWrap:"nowrap",paddingTop:"12px"}} >
        <div>
            {Array.from({length: maxRank}, (v, k) => <RankDisp key={k} h={sHeight}><div style={{marginTop:"auto",marginBottom:"auto"}}>{k + 1}.</div></RankDisp>)}
        </div>
        <SubmissionsBox>
            <TransitionGroup component={null}>
            {subs.slice().sort(compSub).slice(0,maxRank).map((sub, idx) =>
                <CSSTransition key={sub.id} timeout={0.1}>
                    <AnimSubmission 
                        pos={`${idx*110}%`}
                    >
                        <Submission sub={sub} playable={playable} onPlay={playable ? ()=>{onPlay(sub.id)} : undefined} playing={playing === sub.id}/>
                    </AnimSubmission>
                </CSSTransition>
            )}
            </TransitionGroup>
            <div ref={sRef} style={{visibility:"hidden", position:"absolute"}}>
                <Submission sub={SampleSubmission()}/>
            </div>
        </SubmissionsBox>
        </div>
    </RankingBox>
    )
}

SubRanking.defaultProps = {
    playable:false,
    onPlay:()=>{},
}