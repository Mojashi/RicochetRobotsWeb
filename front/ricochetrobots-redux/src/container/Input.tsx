import React, {  useCallback, useContext, useEffect,  useRef } from "react"
import { isMobile } from "react-device-detect"
import { useDispatch, useSelector } from "react-redux"

import { InputView } from "../component/room/pane/Input/Input"
import { InputViewMobile } from "../component/room/pane/Input/InputMobile"
import { Dir, DN, LT, RT, UP } from "../model/game/Dir"
import { Robot } from "../model/game/Robot"
import { addHandFromInput, addMySubmission, viewHandsSelector, removeHandFromInput, resetHandFromInput, selectRobotFromInput, inputAcceptableSelector, lastMySubTimeSelector,  isGoalSelector, selectedRobotSelector} from "./GameSlice"

import { WsDispatchContext } from "./Room"
import { SubmitMessage } from "./websocket/clientMessage/submitMessage"

type Props = {
	disable : boolean,
	className? : string,
}

export function useController(): [()=>void,()=>void,()=>void,(dir:Dir)=>void,(id:Robot, wh:boolean)=>void, boolean[]]{
	const hands = useSelector(viewHandsSelector)
	const isGoal = useSelector(isGoalSelector)
	const myLastSubTime = useSelector(lastMySubTimeSelector)
	const wsDispatch = useContext(WsDispatchContext)
	const dispatch = useDispatch()
	const selected = useSelector(selectedRobotSelector)

	const handleSubmit = useCallback(()=>{
		if(!isGoal) return
		if(Date.now() - myLastSubTime > 1000) {
			dispatch(addMySubmission(hands))
			if(wsDispatch)
				wsDispatch(new SubmitMessage(hands))
		}
	}, [wsDispatch, hands, isGoal, myLastSubTime])

	const handleMove=(dir:Dir)=>{
		selected.forEach((p,id)=>{
			if(p) dispatch(addHandFromInput({dir:dir, robot:id}))
		})
	}

	const setSelectRobot = (id : Robot, wh : boolean)=>{
		dispatch(selectRobotFromInput({robot:id, selected:wh}))
	}

	const handleRemove = useCallback(()=>dispatch(removeHandFromInput()),[removeHandFromInput, dispatch])
	const handleReset = useCallback(()=>dispatch(resetHandFromInput()), [dispatch, resetHandFromInput])

	return [handleSubmit, handleRemove, handleReset, handleMove, setSelectRobot, selected]
}

export function Input({disable, className} : Props){
	const hands = useSelector(viewHandsSelector)
	const enableControls = useSelector(inputAcceptableSelector)
	const [handleSubmit, handleRemove, handleReset, handleMove, setSelectRobot] = useController()
	
	const beforeEventTime = useRef(Array.from({length:10}, ()=>Date.now()))
	const fire = (idx:number, func : ()=>any)=>{
		const now = Date.now()
		if(now - beforeEventTime.current[idx] < 100) return
		beforeEventTime.current[idx] = now
		func()
	}


	useEffect(()=>{
		const handleKeyDown = (e: KeyboardEvent) => {
			if(disable) return
			switch(e.key){
			case "1": setSelectRobot(0, true);break
			case "2": setSelectRobot(1, true);break
			case "3": setSelectRobot(2, true);break
			case "4": setSelectRobot(3, true);break
			case "5": setSelectRobot(4, true);break
			case "ArrowDown":fire(0, ()=>handleMove(DN));break
			case "ArrowUp":fire(1, ()=>handleMove(UP));break
			case "ArrowLeft":fire(2, ()=>handleMove(LT));break
			case "ArrowRight":fire(3, ()=>handleMove(RT));break
			case "Backspace":fire(4, handleRemove);break
			case "Enter":fire(5,handleSubmit);break
			case "r": fire(6, handleReset); break
			}
		}
		const handleKeyUp = (e: KeyboardEvent) => {
			if(disable) return
			switch(e.key){
			case "1": setSelectRobot(0,false);break
			case "2": setSelectRobot(1,false);break
			case "3": setSelectRobot(2,false);break
			case "4": setSelectRobot(3,false);break
			case "5": setSelectRobot(4,false);break
			}
		}

		document.addEventListener("keydown", handleKeyDown)
		document.addEventListener("keyup", handleKeyUp)
		return () => {
			document.removeEventListener("keydown", handleKeyDown)
			document.removeEventListener("keyup", handleKeyUp)
		}
	}, [disable, handleSubmit, handleRemove, handleReset, handleMove, setSelectRobot])

	return isMobile? <InputViewMobile onBack={handleRemove} hands={hands} onReset={handleReset} onSubmit={handleSubmit} className={className}
		disableControls={!enableControls} disableSubmit={false}/>:
		<InputView hands={hands} onBack={handleRemove} onReset={handleReset} onSubmit={handleSubmit} className={className}
			disableControls={!enableControls} disableSubmit={false}/>
}

Input.defaultProps = {
	disable:false,
}