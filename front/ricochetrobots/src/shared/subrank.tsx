import { Hand } from "../game/hand"
import User from "./user"
import styled, { keyframes } from "styled-components"
import { useRecoilValue } from "recoil"
import { userState } from "../recoil_states"
import { useEffect, useRef, useState } from "react"
import { CSSTransition } from "react-transition-group"
import { compSub } from "../util"


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
    padding: 12px 12px 12px 5px;

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
    grid-template-columns: 2fr 4fr 4fr;
    overflow:hidden;
    z-index:10;
    /* position:absolute; */
    height:100%;
    width:100%;
    box-sizing:border-box;
    position:relative;
    
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
    font-size:larger;
    grid-column:2;
    grid-row:1;
`
const NameText = styled.div`
    text-align:right;
    font-size:small;
    grid-column:2/4;
    grid-row:2;
`

const RankBox = styled.div`
    grid-column:1;
    grid-row-start:1;
    grid-row-end:3;
    display:flex;
    align-items:center;
    flex-direction:vertical;
    font-size:larger;
    /* color:#434fa9; */
    width:100%;
`

function getRankStr(rank : number) : string {
    const rs = rank.toString()
    if(rs[rs.length-1] === "1") return rs+"st"
    if(rs[rs.length-1] === "2") return rs+"nd"
    if(rs[rs.length-1] === "3") return rs+"rd"
    return rs+"th"
}

function Submission(props : {rank:number, sub : SubmissionModel}) {
    const {rank, sub} = props

    return (
        <ResBox opt={sub.opt}>
            <RankBox><div style={{marginLeft:"auto", marginRight:"auto"}}>{(rank + 1).toString()}</div></RankBox>
            <MainBox>{sub.hands.length.toString().padStart(2," ") +" moves"} </MainBox>
            <NameText>{`by ${sub.user.name}`}</NameText>
        </ResBox>
    )
}

const RankingBox = styled('div') `
    white-space: nowrap;
    width:100%;
`

const RankingTitle = styled('div') `
    color:saddlebrown;
    font-weight: bold;
    font-size: x-large;
    position:relative;
    text-align:center;
    border-radius: 4px;
    border: solid;
`

const SubmissoinsBox = styled("div")`
    position:relative;
    width:100%;
`

const appear = (x:string, y:string, t:string) => keyframes`
    0%{
        transform: translateY(${y}) translateX(${x});
        opacity:0;
    }
    50%{
        transform: translateY(${y}) translateX(${x});
        opacity:1;
    }
    100%{
        transform: translateY(${t}) translateX(${0});
        opacity:1;
    }
`
const AnimSubmission = styled("div")<{pos:string, animate:boolean, mine:boolean, sx:string,sy:string}>`
    position:absolute;
    transform: translateY(${p=>p.pos});
    transition:transform 0.5s; 
    animation:${p=>p.animate ? (p.mine?appear(p.sx,p.sy,p.pos):appear("0", "100vh",p.pos)):""} 2s ease-in-out;
    box-sizing:border-box;
    width:100%;
    margin: 12px 12px 12px 0px;
    z-index:10;
    height:8ex;
`

export default function SubRanking(props : {subs : SubmissionModel[], animate: number[]}){
    const {subs, animate} = props
    const [sButtonPos, setSButtonPos] = useState([0,0])
    const ref = useRef<HTMLDivElement>(null)
    const animated = useRef(new Map<number,boolean>())
    const user = useRecoilValue(userState)

    useEffect(()=>{
        if(animated.current === null) return;
        animate.forEach((a)=>{
            if(!animated.current.has(a)){
                animated.current.set(a, true)
            }
        })
    },[animate])

    useEffect(()=>{
        if(ref.current === null) return;
        const belm = document.getElementById("SendButton")
        if(!belm) return;
        setSButtonPos([belm.getBoundingClientRect().left - ref.current.getBoundingClientRect().left, belm.getBoundingClientRect().top - ref.current.getBoundingClientRect().top])
        console.log([belm.getBoundingClientRect().left, ref.current.getBoundingClientRect().left])
    },[ref.current])

    return (
        <RankingBox>
        <RankingTitle>SUBMISSIONS</RankingTitle>
        <SubmissoinsBox ref={ref}>
        {subs.sort(compSub).map((sub, idx) =>
            <AnimSubmission key={sub.id.toString()} pos={`${idx*110}%`} sx={sButtonPos[0]+"px"} sy={sButtonPos[1]+"px"} mine={user!==null && user.id===sub.user.id} animate={animated.current.get(sub.id) as boolean} onAnimationEnd={()=>{animated.current.set(sub.id, false)}}>
                <Submission sub={sub} rank={idx}/>
            </AnimSubmission>
        )}
        </SubmissoinsBox>
        </RankingBox>
    )
}