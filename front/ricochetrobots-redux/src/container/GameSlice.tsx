import { Action, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { Hands } from "../model/game/Hands"
import { Pos, PosExample } from "../model/game/Pos"
import { Problem, ProblemExample } from "../model/game/Problem"
import { OptSubSample, Submission, ResultSubmission, SubSample, MySubmission } from "../model/game/Submission"
import { InputReducers } from "./reducers/InputReducers"
import { GameReducers } from "./reducers/GameReducers"
import { ServerEventReducers } from "./reducers/ServerEventReducers"
import { LeaderBoardUser } from "../component/room/pane/LeaderBoard"
import { User, UserExample, UserID } from "../model/User"
import produce from "immer"
import { ResultReducers } from "./reducers/ResultReducers"
import { BoardViewReducers } from "./reducers/BoardViewReducers"
import { GameConfig } from "../model/game/GameConfig"
import { RoomInfo } from "../model/RoomInfo"
import { RoomInfoReducer } from "./reducers/RoomInfoReducer"

export type PointsDict = {
    [key:number] : number
}
export type ParticipantsDict = {
    [key:number] : User
}

export type OnlineDict = {
    [key:number] : boolean
}

type GameState = {
    readonly gameID : number
    readonly points : PointsDict // <userId, points>
}

type ProblemState = {
    readonly problem : Problem
    readonly timeleft? : number
    readonly shortest? : Submission
    readonly submissions : Submission[]
    readonly mySubmissions : MySubmission[]
}
type ResultState = {
    readonly problem : Problem
    readonly submissions? : ResultSubmission[]

    readonly animFrame? : number
    readonly animSub? : ResultSubmission
    readonly animID : number
}

type BoardViewState = {
    readonly problem? : Problem
    readonly hands : Hands
    readonly selectedRobot : boolean[]
    readonly robotPosHistory : Pos[][]
}

export type Notification = {
    id : number
    msg : string
}

export type RoomState = {
    readonly roomInfo? : RoomInfo
    readonly notifications : Notification[]
    readonly participants : ParticipantsDict
    readonly onlineUsers : OnlineDict

    readonly problemState? : ProblemState
    readonly boardViewState : BoardViewState
    readonly gameState? : GameState
    readonly resultState? : ResultState
}

var initialState:RoomState = {
    notifications : [],
    participants : {},
    onlineUsers : {},
    boardViewState : {
        hands : [],
        selectedRobot : [],
        robotPosHistory : [],
    }
}
// initialState = testState

// createSliceでreducerとactionを同時に定義
const slice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        ...RoomInfoReducer,
        ...ServerEventReducers,
        ...GameReducers,
        ...InputReducers,
        ...ResultReducers,
        ...BoardViewReducers,
    },
})

const selectSelf = (state : RootState) => state.game
const selectRoomInfo = (state: RootState) => state.game.roomInfo
const selectGame = (state: RootState) => state.game.gameState
const selectResult = (state: RootState) => state.game.resultState
const selectBoardView = (state: RootState) => state.game.boardViewState
const selectProblem = (state: RootState) => state.game.problemState

export const { addHandFromInput, resetHandFromInput, removeHandFromInput, setProblem,finishResult, selectRobot, setPoint,tellUser, joinToRoom, leaveFromRoom, finishGame,finishProblem,finishProblemFromServer, setTimeleft, startGame,
     addSubmission, setShortest, setShortestFromServer,addSubmissionFromServer, addHiddenSubmissionFromServer,
     animNext,animStop,animStart, addMySubmission , setRoomInfo, notify, removeNotify} = slice.actions

export const isGoalSelector = createSelector(selectBoardView, state=>{
    if(state.problem === undefined || state?.robotPosHistory.length === 0) return false
    const pos = state.robotPosHistory[state.robotPosHistory.length - 1][state.problem.mainRobot]
    return state.problem.board.cells[pos.y][pos.x].goal
})
export const notifSelector = createSelector(selectSelf, state=>state.notifications)
export const viewHandsSelector = createSelector(selectBoardView, state=>state?.hands)
export const viewProblemSelector = createSelector(selectBoardView, state=>state?.problem)
export const submissionsSelector = createSelector(selectProblem, state=>state?.submissions)
export const selectedRobotSelector = createSelector(selectBoardView, state=>state?.selectedRobot)
export const shortestSelector = createSelector(selectProblem, state=>state?.shortest)
export const resultSubsSelector = createSelector(selectResult, state=>state?.submissions)
export const resultProblemSelector = createSelector(selectResult, state=>state?.problem)
export const resultAnimSubSelector = createSelector(selectResult, state=>state?.animSub)
export const resultAnimIDSelector = createSelector(selectResult, state=>state?.animID)
export const roomInfoSelector = createSelector(selectRoomInfo, state=>state)
export const timeLeftSelector = createSelector(selectProblem, state=>state?.timeleft)
export const onGameSelector = createSelector(selectSelf, state=>state.gameState !== undefined)
export const problemExistsSelector = createSelector(selectProblem, state => state !== undefined)
export const intervalSelector = createSelector(selectResult, state=>state !== undefined)
export const lastMySubTimeSelector = createSelector(selectProblem, state=>{
    const len = state?.mySubmissions.length
    if(state && len !== undefined && len > 0) return state.mySubmissions[len - 1].timeStamp
    else return 0 
})
export const inputAcceptableSelector = createSelector(selectSelf, state=>state.resultState === undefined && state.problemState !== undefined )
// export const webSocketSelector = createSelector(selectSelf, state=>state.webSocket)
export const possSelector = createSelector(selectBoardView, state=>{
    if(state.robotPosHistory.length > 0) return state.robotPosHistory[state.robotPosHistory.length-1]
    else return []
})
export const leaderBoardSelector = createSelector(selectSelf, state=>{
    if(state.gameState)
        return Object.entries(state.gameState.points).map(
            ([userID, point], _) => ({user : state.participants[parseInt(userID)] , point: point})
        ).sort((a,b)=>b.point - a.point)
    return []
})
export const gameSlice = slice