import React, { useCallback, useContext, useEffect, useMemo, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { InputView } from "../component/room/pane/Input/Input"
import { Dir, DN, LT, RT, UP } from "../model/game/Dir"
import { addHandFromInput, addMySubmission, viewHandsSelector, removeHandFromInput, resetHandFromInput, selectRobot, inputAcceptableSelector, lastMySubTimeSelector, possSelector, isGoalSelector} from "./GameSlice"
import { Problem } from "./Problem"
import { WsDispatchContext } from "./Room"
import { SubmitMessage } from "./websocket/clientMessage/submitMessage"

type Props = {
    disable : boolean,
    className? : string,
}

export function Input({disable, className} : Props){
    const hands = useSelector(viewHandsSelector)
    const isGoal = useSelector(isGoalSelector)
    const myLastSubTime = useSelector(lastMySubTimeSelector)
    const pushed = useRef<boolean[]>([false,false,false,false,false])
    const dispatch = useDispatch()
    const wsDispatch = useContext(WsDispatchContext)
    const beforeEventTime = useRef(Array.from({length:10}, _=>Date.now()));
    const enableControls = useSelector(inputAcceptableSelector)

    const handleSubmit = useCallback(()=>{
        if(!isGoal) return;
        if(Date.now() - myLastSubTime > 1000) {
            dispatch(addMySubmission(hands))
            if(wsDispatch)
                wsDispatch(new SubmitMessage(hands))
            }
    }, [wsDispatch, hands, isGoal, myLastSubTime])

    const handleRemove = useCallback(()=>dispatch(removeHandFromInput()),[removeHandFromInput, dispatch])
    const handleReset = useCallback(()=>dispatch(resetHandFromInput()), [dispatch, resetHandFromInput])

    useEffect(()=>{
        const handlePushArrow=(dir:Dir)=>{
            pushed.current.forEach((p,id)=>{
                if(p) dispatch(addHandFromInput({dir:dir, robot:id}));
            })
        }
        const fire = (idx:number, func : ()=>any)=>{
            const now = Date.now();
            if(now - beforeEventTime.current[idx] < 100) return
            beforeEventTime.current[idx] = now;
            func();
        }
        const pushNum = (id : number, selected : boolean)=>{
            if(pushed.current[id] !== selected){
                pushed.current[id] = selected
                dispatch(selectRobot({robot:id, selected:selected}))
            }
        }
        const handleKeyDown = (e: KeyboardEvent) => {
            if(disable) return;
            switch(e.key){
                case "1": pushNum(0, true);break;
                case "2": pushNum(1, true);break;
                case "3": pushNum(2, true);break;
                case "4": pushNum(3, true);break;
                case "5": pushNum(4, true);break;
                case "ArrowDown":fire(0, ()=>handlePushArrow(DN));break;
                case "ArrowUp":fire(1, ()=>handlePushArrow(UP));break;
                case "ArrowLeft":fire(2, ()=>handlePushArrow(LT));break;
                case "ArrowRight":fire(3, ()=>handlePushArrow(RT));break;
                case "Backspace":fire(4, handleRemove);break;
                case "Enter":fire(5,handleSubmit);break;
                case "r": fire(6, handleReset); break;
            }
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            if(disable) return;
            switch(e.key){
                case "1": pushNum(0,false);break;
                case "2": pushNum(1,false);break;
                case "3": pushNum(2,false);break;
                case "4": pushNum(3,false);break;
                case "5": pushNum(4,false);break;
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        document.addEventListener("keyup", handleKeyUp)
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            document.removeEventListener("keyup", handleKeyUp)
        }
    }, [disable, handleSubmit])

    return <InputView hands={hands} onReset={handleReset} onSubmit={handleSubmit} className={className}
        disableControls={!enableControls} disableSubmit={false}/>
    
}

Input.defaultProps = {
    disable:false,
}