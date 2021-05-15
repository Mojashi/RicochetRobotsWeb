import { Action, PayloadAction } from "@reduxjs/toolkit"
import { Hand } from "../../model/game/Hand"
import {current, Draft, produce} from "immer"
import { moveRobot } from "../../model/game/board/Board"
import {animStart, State,getGameState, RoomState, getRoomState, getProblemState} from "../GameSlice"
import { Problem } from "../../model/game/Problem"
import { OptSubSample, ResultSubmission, Submission, SubSample } from "../../model/game/Submission"
import Game from "../../model/game/Game"
import { UnknownUser, User, UserExample, UserID } from "../../model/User"
import { initBoardView } from "./BoardViewReducers"
import { animStartFunc, finishResultFunc, initResultState, resetRobots } from "./ResultReducers"
import { WritableDraft } from "immer/dist/internal"
import { Room } from "../../model/Room"
import { Hands } from "../../model/game/Hands"
import { LeaderBoardUser } from "../../component/room/pane/LeaderBoard"

export const setProblemFunc = (draft : Draft<RoomState>, problem : Problem)=> {
    if(draft.gameState) {
        draft.problemState = {
            problem: problem,
            submissions : [],
            mySubmissions : [],
            hint : [],
        }
        if(draft.problemResultState && draft.problemResultState.readyNext){
            finishResultFunc(draft)
        }
        if(draft.problemResultState === undefined){
            startProblemFunc(draft)
        }
    }
}
export const setShortestFunc = (draft : Draft<RoomState>, sub : Submission)=> {
    if(draft.problemState)
        draft.problemState.shortest = sub
}
export const addSubmissionFunc = (draft : Draft<RoomState>, sub : Submission)=> {
    draft.problemState?.submissions.push(sub)
}
export const setPointFunc = (draft : Draft<RoomState>, userID : UserID, point : number)=> {
    if(draft.gameState){
        draft.gameState.points[userID] = point
        if(!draft.participants.hasOwnProperty(userID)){
            draft.participants[userID] = UnknownUser
        }
    }
}

export function finishProblemFunc(draft : Draft<RoomState>, subs : ResultSubmission[]) {
    if(draft.problemState){
        initResultState(draft, draft.problemState.problem, subs)
        animStartFunc(draft, subs[0])
        draft.problemState = undefined
    }
}

export function startProblemFunc(draft : WritableDraft<RoomState>) {
    if(draft.problemState){
        draft.problemResultState = undefined
        initBoardView(draft, draft.problemState.problem)
    }
}
export function joinToGameFunc(draft : WritableDraft<RoomState>, user : User) {
    if(draft.gameState){
        if(!draft.gameState.points.hasOwnProperty(user.id))
            draft.gameState.points[user.id] = 0
    }
}

export function setGameResultFunc(draft : WritableDraft<RoomState>, leaderboard: LeaderBoardUser[]) {
    draft.gameResultState = {
        leaderboard:leaderboard,
    }
}
export function setHintFunc(draft : WritableDraft<RoomState>, hint : Hands) {
    if(draft.problemState) {
        draft.problemState.hint = hint
    }
}

export const GameReducers = {
    setProblem: (state:State, action : PayloadAction<Problem>) => (
        produce(state, draft => setProblemFunc(getRoomState(draft), action.payload))
    ),
    addSubmission: (state:State, action : PayloadAction<Submission>) => (
        produce(state, draft => addSubmissionFunc(getRoomState(draft), action.payload))
    ),
    setShortest: (state:State, action : PayloadAction<Submission>) => (
        produce(state, draft => setShortestFunc(getRoomState(draft), action.payload))
    ),
    setPoint: (state: State, action : PayloadAction<{userID:UserID, point:number}>) => (
        produce(state, draft => setPointFunc(getRoomState(draft), action.payload.userID, action.payload.point))
    ),
    setTimeleft: (state : State, action : PayloadAction<number>) => (
        produce(state, draft => {
            const problem = getProblemState(draft)
            if(problem)
                problem.timeleft = action.payload
        })
    ),
    finishGame: (state : State, action : Action) => (
        produce(state, draft => {
            const room = getRoomState(draft)
            const gameState = getGameState(draft)
            if(gameState !== undefined) {
                const leaderboard = Object.entries(gameState.points).map(
                   ([userID, point], _) => ({user : room.participants[parseInt(userID)] , point: point, online:room.onlineUsers[parseInt(userID)]})
                ).sort((a,b)=>b.point - a.point)
                if(leaderboard.length > 0)
                    setGameResultFunc(room, leaderboard)
                room.problemState = undefined
                room.gameState = undefined
            }
        })
    ),
    finishProblem: (state : State, action : PayloadAction<ResultSubmission[]>) => (
        produce(state, draft => finishProblemFunc(getRoomState(draft), action.payload))
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
                room.problemResultState = undefined
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
    ),
    setGameResult : (state : State, action : PayloadAction<LeaderBoardUser[]>) => (
        produce(state, draft => setGameResultFunc(getRoomState(draft), action.payload))
    ),
    setHint : (state : State, action : PayloadAction<Hands>) => (
        produce(state, draft => setHintFunc(getRoomState(draft), action.payload))
    )
}