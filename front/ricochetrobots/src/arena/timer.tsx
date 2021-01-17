
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
    duration : number
}

const circleanim = keyframes`
    0%{
        stroke-dashoffset:500;
        stroke-dasharray:500;
    }
    100%{
        stroke-dashoffset:0;
        stroke-dasharray:500;
    }
`

const Circle = styled("circle")`
    stroke-width:8;
    animation:10s ${circleanim} linear;
`

export default function CircleTimer(props : Props){
    const {duration} = props
    const [rest, setRest] = useState(duration)

    useEffect(()=>{
        const id=setInterval(()=>{setRest(r=>r>0?r-1:r)},1000)
        // return clearTimeout(id)
    }, [])

    return (
        <TimerBox>
        <svg height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g>
            <Circle transform="rotate(-90,50,50)" cx="50" cy="50" r="42" fill="transparent" stroke="black"/>
            {/* <animate attributeName="rx" values="0;5;0" dur="10s" repeatCount="1" />   */}
            <text x="50" y="50" fontWeight="bold" fontSize="xx-large" textAnchor="middle" dominantBaseline="central">
                {rest}
            </text>
        </g>
        </svg>
        {/* <span style={{position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)"}}>40</span> */}
        </TimerBox>
    )
}