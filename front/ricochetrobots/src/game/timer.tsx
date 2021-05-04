
import { Timer } from "@material-ui/icons"
import { useEffect, useState } from "react"
import styled, { keyframes } from "styled-components"

const TimerBox = styled("div")`
    background-color:rgba(0,0,0,0);
    height:100%;
    text-align:center;
    position:"relative";
`

interface Props {
    inplay : boolean,
    duration : number,
    onFinish : ()=>void
}

// const circleanim = keyframes`
//     0%{
//         stroke-dashoffset:500;
//         stroke-dasharray:500;
//     }
//     100%{
//         stroke-dashoffset:0;
//         stroke-dasharray:500;
//     }
// `

const Circle = styled("circle")<{rate:number, interval:number, r:number, inplay:boolean}>`
    stroke-width:8;
    stroke-linecap:round;
    stroke-dasharray:${p=>p.r * 6.28};
    stroke-dashoffset:${p=>p.r * 6.28};
    ${p => p.inplay && `
        stroke-dashoffset:${p.r * 6.28* p.rate};
        transition: stroke-dashoffset ${p.interval}s linear;
    `}
    r:${p=>p.r};
`

export default function CircleTimer(props : Props){
    const {inplay, duration, onFinish} = props
    const [rest, setRest] = useState(0)

    useEffect(()=>{
        setRest(0);
    }, [inplay])

    useEffect(()=>{
        console.log(duration)
        if(duration === null) return;
        const id=setInterval(()=>{
            setRest(r=>{
                if(r < duration * 10) return r+1
                else {
                    clearTimeout(id)
                    onFinish()
                    return 0
                }
            })},100
        )
        return ()=>{clearTimeout(id);}
    }, [inplay, duration, onFinish])

    return (
        <TimerBox>
        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g>
            <circle cx="50" cy="50" r={42} fill="transparent" stroke="#8b451333" strokeWidth={8}/>
            <Circle inplay={inplay} interval={1} rate={duration !== null ? 1-Math.ceil(rest/10)/duration: 0} transform="rotate(-90,50,50)" cx="50" cy="50" r={42} fill="transparent" stroke="#F44336"/>
            {/* <animate attributeName="rx" values="0;5;0" dur="10s" repeatCount="1" />   */}
            <text x="50" y="50" fontWeight="bold" fontSize="xx-large" textAnchor="middle" dominantBaseline="central" fill="#F44336">
                {duration !== null ? (duration - rest / 10.0).toFixed(1) : "0.0"}
            </text>
        </g>
        </svg>
        {/* <span style={{position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)"}}>40</span> */}
        </TimerBox>
    )
}

CircleTimer.defaultProps = {
    duration: 0,
    onFinish: ()=>{},
}