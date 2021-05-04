import { useState, Reducer, useReducer, useEffect } from "react"
import HandsInput from "../shared/hands_input"
import { go, Pos } from "../util"
import Board, {BoardModel, BoardProps} from "./board"
import { Hand } from "./hand"
import { makeRobots, RobotModel } from "./robot"


interface SceneState {
    time : number,
    robots : RobotModel[],
}

interface NextSceneAction {
    type:"next",
}
interface ResetSceneAction {
    type: "reset",
    hands: Hand[],
}

type SceneAction = NextSceneAction | ResetSceneAction

const SceneReducer = (initPos: Pos[],hands : Hand[],board : BoardModel, onPlayEnd:()=>void) : React.Reducer<SceneState, SceneAction> => (state, action) => {
    const {time,robots} = state
    switch (action.type) {
        case "next" :
            console.log("next")
            if(time === hands.length) {
                onPlayEnd()
                return state//{time:0, robots:makeRobots(initPos),initPos:initPos, hands:hands, board:board}
            }
            var nps = go(board, robots.map(r=>r.pos), hands[time])
            return {time:time + 1, robots:makeRobots(nps),initPos:initPos, hands:hands, board:board}
        case "reset" :
            console.log("reset")
            return {time:0, robots:makeRobots(initPos),initPos:initPos, hands:action.hands, board:board}
    }
}

type Props = Omit<BoardProps, "onTransitionEnd"> & {
    hands:Hand[],
    onPlayEnd:()=>void,
} 

export default function BoardPlayer (props:Props) {
    const {hands,robots,onPlayEnd, ...rest} = props
    const {board} = rest
    const [scene, sceneDispatch] = useReducer(SceneReducer(robots.map(r=>r.pos), hands, board, onPlayEnd), {time:0, robots:robots})
    
    useEffect(()=>{
        sceneDispatch({type:"reset", hands:hands})
        console.log("changed")
        const id = setInterval(()=>{
            sceneDispatch({type:"next"})
        }, 300)
        return ()=>{clearTimeout(id)}
    }, [hands])

    return (
        <Board {...rest} robots={scene.robots} onTransitionEnd={ () => {
            // sceneDispatch({type:"next", curtime:scene.time})
        }}/>
    )
}

BoardPlayer.defaultProps = {
    hands:[],
    onPlayEnd:()=>{}
}