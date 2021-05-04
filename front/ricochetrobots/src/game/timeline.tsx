import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components"
import { SampleSubmission } from "../sample";
import Submission, { SubmissionModel } from "../shared/submission";
import {CSSTransition, Transition, TransitionGroup} from "react-transition-group"
import { BurnedTitle } from "../shared/useful";

interface Props {
    subs: SubmissionModel[]
}


const InnerBox = styled("div")`
    position:relative;
    width:100%;
    height:100%;
    box-sizing:border-box;
    overflow:hidden;
    padding:0.5em 0.5em 0.5em 0.5em;
    background-color: rgba(0,0,0,0.05);
    &::before{
        margin:-0.5em -0.5em -1em -0.5em;
        position:absolute;
        box-shadow: 0px 0px 10px 0px saddlebrown inset;
        z-index:2;
        padding:0.5em 0.5em 1em 0.5em;  
        height:100%;
        box-sizing:border-box;
        width:100%;
        content:"";
    }
`
const RelBox = styled("div")`
width:100%;height:100%;
position:relative;
box-sizing:border-box;
`

// const appear = 

const AnimBox = styled("div")<{pos:number}>`
    width:100%;
    transition: transform 0.5s linear;
    transform: translateY(${p=>p.pos * 110}%);
    position:absolute;
    &.enter{
        transform: translateY(-110%);
    }
    
`

const Vtext = styled("div")`
    writing-mode: vertical-rl;
    font-size: x-large;
    font-weight: bold;
    color: saddlebrown;
    margin-left: 8px;
    margin-right: 4px;
    border:solid;
    padding-top:1em;
    padding-bottom:1em;
`

export default function SubTimeLine(props : Props){
    const {subs} = props
    const [lnum, setlNum] = useState<number>(1000)
    const sRef = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        function handleResize() {
            if(sRef.current){
                setlNum(Math.ceil(window.innerHeight / sRef.current?.clientHeight));
                console.log(Math.ceil(window.innerHeight / sRef.current?.clientHeight))
           }
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, [])

    return (
        <div style={{height:"100%", width:"100%", display:"flex", flexWrap:"nowrap", alignItems:"flex-start"}}>
        {/* <BurnedTitle>TIMELINE</BurnedTitle> */}
        <InnerBox> 
            <TransitionGroup component={RelBox}>
            {subs.slice(Math.max(0, subs.length - lnum), subs.length).map((sub,idx) => 
                <CSSTransition key={sub.id} timeout={0} >
                    <AnimBox pos={Math.min(subs.length, lnum) - idx - 1} >
                        <Submission sub={sub}/>
                    </AnimBox>
                </CSSTransition>
            )}
            </TransitionGroup>

            <div ref={sRef} style={{visibility:"hidden", position:"absolute"}}>
                <Submission sub={SampleSubmission()}/>
            </div>
        </InnerBox>
            {/* <Vtext>TIMELINE</Vtext> */}
        </div>
    )
}