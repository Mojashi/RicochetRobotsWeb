import { Action, PayloadAction } from "@reduxjs/toolkit"
import { Hand } from "../../model/game/Hand"
import {current, Draft, produce} from "immer"
import { moveRobot } from "../../model/game/board/Board"
import {animStart, State, getGameState, getProblemState, getRoomState, getResultState} from "../GameSlice"
import { Problem } from "../../model/game/Problem"
import { OptSubSample, ResultSubmission, Submission, SubSample } from "../../model/game/Submission"
import Game from "../../model/game/Game"
import { UnknownUser, User, UserExample, UserID } from "../../model/User"
import { initBoardView } from "./BoardViewReducers"
import { animStartFunc, initResultState, resetRobots } from "./ResultReducers"
import { Room } from "../../model/Room"
import { Hands } from "../../model/game/Hands"

export function setProblemFunc (draft : Draft<State>, problem : Problem) {
    if(getGameState(draft)) {
        getRoomState(draft).problemState = {
            problem: problem,
            submissions : [],
            mySubmissions : [],
        }
        if(getResultState(draft) === undefined){
            startProblemFunc(draft)
        }
    }
}
export function setShortestFunc (draft : Draft<State>, sub : Submission) {
    const problem = getProblemState(draft)
    if(problem)
        problem.shortest = sub
}
export function addSubmissionFunc (draft : Draft<State>, sub : Submission) {
    const problem = getProblemState(draft)
    problem?.submissions.push(sub)
}
export const setPointFunc = (draft : Draft<State>, userID : UserID, point : number)=> {
    const game = getGameState(draft)
    if(game){
        game.points[userID] = point
        if(!getRoomState(draft).participants.hasOwnProperty(userID)){
            getRoomState(draft).participants[userID] = UnknownUser
        }
    }
}

export function finishProblemFunc(draft : Draft<State>, subs : ResultSubmission[]) {
    const problem = getProblemState(draft)
    if(problem){
        initResultState(draft, problem.problem, subs)
        animStartFunc(draft, subs[0])
        getRoomState(draft).problemState = undefined
    }
}

export function startProblemFunc(draft : Draft<State>) {
    const problem = getProblemState(draft)
    if(problem){
        getRoomState(draft).resultState = undefined
        initBoardView(draft, problem.problem)
    }
}
export function joinToGameFunc(draft : Draft<State>, user : User) {
    const game = getGameState(draft)
    if(game){
        if(!game.points.hasOwnProperty(user.id))
            game.points[user.id] = 0
    }
}

export const GameReducers = {
    setProblem: (state:State, action : PayloadAction<Problem>) => (
        produce(state, draft => setProblemFunc(draft, action.payload))
    ),
    addSubmission: (state:State, action : PayloadAction<Submission>) => (
        produce(state, draft => addSubmissionFunc(draft, action.payload))
    ),
    setShortest: (state:State, action : PayloadAction<Submission>) => (
        produce(state, draft => setShortestFunc(draft, action.payload))
    ),
    setPoint: (state: State, action : PayloadAction<{userID:UserID, point:number}>) => (
        produce(state, draft => setPointFunc(draft, action.payload.userID, action.payload.point))
    ),
    setTimeleft: (state : State, action : PayloadAction<number>) => (
        produce(state, draft => {
            const problem = getProblemState(state)
            if(problem)
                problem.timeleft = action.payload
        })
    ),
    finishGame: (state : State, action : Action) => (
        produce(state, draft => {
            const room = getRoomState(draft)
            room.problemState = undefined
            room.gameState = undefined
        })
    ),
    finishProblem: (state : State, action : PayloadAction<ResultSubmission[]>) => (
        produce(state, draft => finishProblemFunc(draft, action.payload))
    ),
    startGame: (state : State, action : PayloadAction<number>) => (
        produce(state, draft => {
            const game = getGameState(draft)
            const room = getRoomState(draft)
            if (game === undefined || game?.gameID !== action.payload) {
                room.gameState = {
                    gameID : action.payload,
                    points : {},
                }
                room.resultState = undefined
            }
        })
    ),
    addMySubmission : (state : State, action : PayloadAction<Hands>) => (
        produce(state, draft => {
            getProblemState(draft)?.mySubmissions.push({
                hands : action.payload,
                timeStamp : Date.now(),
            })
        })
    )
}