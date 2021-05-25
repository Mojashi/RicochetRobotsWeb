import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { useImmer } from "use-immer"
import { Dir, DN, LT, RT, UP } from "../../../../model/game/Dir"
import { Pos } from "../../../../model/game/Pos"
import { Robot } from "../../../../model/game/Robot"
import { RobotIconSvg } from "../../../accessory/RobotIconSvg"

type Props = {
    onTouch :(id:Robot)=>void
    onRelease :(id:Robot)=>void
    onMove?: (dir : Dir)=>void
    className? : string
    selected: boolean[]
    handsLength : number
}

const edgeLen = 10
const longR = edgeLen/2 / Math.sin(Math.PI*36/180)
const shortR = edgeLen/2 / Math.tan(Math.PI*36/180)
const cell = shortR + longR
const vboxw = (cell + edgeLen/2)*2
const vboxh = cell*2 + Math.cos(Math.PI * 18 / 180) * edgeLen

export function RobotButtonsView({className, onTouch,handsLength, onRelease,onMove, selected} : Props) {
    // const [posDiff, setPosDiff] = useImmer<Pos[]>([{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}])
    // const touchMap = useRef<([number,Pos]|undefined)[]>([undefined,undefined,undefined,undefined,undefined])

    // const handleMove = (ev : React.TouchEvent)=>{
    //     const touches = ev.changedTouches
    //     for(var i = 0; touches.length > i; i++){
    //         const touch = touches[i]
    //         const r = touchMap.current.findIndex(a=>a?.[0]===touch.identifier)
    //         if(r!==-1){
    //             const st = touchMap.current[r]?.[1]
    //             const diff = {x:(touch.clientX - st!.x)/scale[0],y:(touch.clientY - st!.y)/scale[1]}
    //             const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y)
    //             if(dist >= 6){
    //                 const p = 6/dist
    //                 diff.x *= p
    //                 diff.y *= p
    //             }
    //             setPosDiff(draft=>{draft[r] = diff})
    //         }
    //     }
    // }
    // const [scale,setScale] = useState<number[]>([0,0])
    // const handleStart = (ev : React.TouchEvent, r:Robot)=>{
    //     const touch = ev.changedTouches[0]
    //     touchMap.current[r] = [touch.identifier, {x:touch.clientX,y:touch.clientY}]
    // }
    // const handleRelease = (ev : React.TouchEvent, r:Robot)=>{
    //     const touch = ev.changedTouches[0]
    //     const a = touchMap.current[r]
    //     if(a !== undefined) {
    //         const st = a[1]
    //         const diff = {x:(touch.clientX - st.x),y:(touch.clientY - st.y)}
    //         console.log(diff)
    //         if(Math.max(diff.x,diff.y, -diff.x, -diff.y) > 30){
    //             const dir = Math.abs(diff.x) > Math.abs(diff.y) ? (diff.x>0? RT:LT) : (diff.y>0?DN:UP)
    //             onMove(dir)
    //             console.log(dir)
    //         }
    //         touchMap.current[r] = undefined
    //         setPosDiff(draft=>{draft[r]={x:0,y:0}})
    //         onRelease(r);
    //     }
    // }

    // const ref = useRef<SVGSVGElement>(null)
    // useEffect(()=>{
    //     if(ref.current){
    //         const {width,height} =ref.current.getBoundingClientRect()
    //         console.log([width/vboxw, height/vboxh])
    //         setScale([width/vboxw, height/vboxh])
    //     }
    // }, [ref.current])

    return <Svg className={className} viewBox={`${-vboxw/2} ${-vboxh/2} ${vboxw} ${vboxh}`}
        >
        <defs>
    <filter id="shadow">
      <feDropShadow dx="0" dy="0" stdDeviation="0.3"/>
    </filter>
    </defs>
        {Array.from({length:5}).map((_,idx)=>
        <RobotIconSvg rid={idx} 
                    onTouchStart={(ev)=>{onTouch(idx); }}
                    onTouchEnd={(ev)=>{onRelease(idx)}}
                    onTouchCancel={(ev)=>{ onRelease(idx)}}
                    x={Math.cos(idx * Math.PI*2/5-Math.PI/2)*(shortR*2-1.5) - cell/2}
                    y={Math.sin(idx * Math.PI*2/5-Math.PI/2)*(shortR*2-1.5) - cell/2}
                    width={cell} 
                    height={cell}
                    
                    style={{filter:selected[idx] ? "url(#shadow)":""}}
                    />
                    )}
        <text 
         text-anchor = "middle"
         dominant-baseline = "central"
         y={1}
         style={{fontSize:"0.5em",fontFamily:"Odibee Sans"}}
        >
            {handsLength}
        </text>
    </Svg>

}
const Svg = styled("svg")`
    overflow:visible;
`