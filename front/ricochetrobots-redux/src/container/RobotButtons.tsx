import React, { useCallback, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux";
import styled from "styled-components"
import { useImmer } from "use-immer";
import { RobotButtonsView } from "../component/room/pane/Input/RobotButtons"
import { Dir, DN, LT, RT, UP } from "../model/game/Dir";
import { Robot } from "../model/game/Robot";
import { viewHandsSelector } from "./GameSlice";
import { useController } from "./Input";

export function useSwipe(onSwipe:(dir:Dir)=>void, r : number){
    const touch = useRef<React.Touch|undefined>()

    const onTouchStart = useCallback((ev:React.TouchEvent)=>{
        if(touch.current || ev.changedTouches.length === 0) return;
        touch.current = ev.changedTouches[0]
    }, [touch])
    const onTouchEnd = useCallback((ev:React.TouchEvent)=> {
        if(!touch.current || ev.changedTouches.length === 0) return;
        const touches = ev.changedTouches
        for(var i = 0; touches.length > i; i++){
            if(touches[i].identifier !== touch.current.identifier) continue
            const d = [touches[i].pageX - touch.current.pageX, touches[i].pageY - touch.current.pageY]
            const diff = Math.max(d[0], d[1], -d[0], -d[1])
            if(diff >= r){
                const dir = Math.abs(d[0]) > Math.abs(d[1]) ? (d[0]>0? RT:LT) : (d[1]>0?DN:UP)
                onSwipe(dir)
            }
            touch.current = undefined
            break
        }
    }, [r, onSwipe])

    return {onTouchStart,onTouchEnd}
}

export function RobotButtons (props : Omit<Omit<Omit<Omit<Omit<React.ComponentProps<typeof RobotButtonsView>,"handsLength">,"onTouch">,"onRelease">,"selected">,"onMove">) {
    const [handleSubmit, handleRemove, handleReset, handleMove, setSelectRobot,selected] = useController()
    const handlers = useSwipe(
        handleMove, 50
    )
    const hands = useSelector(viewHandsSelector)

    return <>
        <FillDiv {...handlers} className={selected.includes(true)?"enable":""}/>
        <RobotButtonsView 
            handsLength={hands.length}
            onTouch={(r)=>{setSelectRobot(r,true)}} 
            onRelease={(r)=>{setSelectRobot(r,false)}}
            selected={selected}

            {...props}/>
    </>
}

const FillDiv = styled("div")`
    position: fixed;
    left: 0;
    top : 0;
    width:100vw;
    height:100vh;
    display:none;
    &.enable{
        display:block;
    }
`