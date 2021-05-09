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
import { AnonymousUser, User, UserExample, UserID } from "../model/User"
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

type SiteState = {
    user : User,
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
    readonly needToAuth : boolean

    readonly roomInfo? : RoomInfo
    readonly notifications : Notification[]
    readonly participants : ParticipantsDict
    readonly onlineUsers : OnlineDict

    readonly problemState? : ProblemState
    readonly boardViewState : BoardViewState
    readonly gameState? : GameState
    readonly resultState? : ResultState
}

export type State = {
    readonly siteState : SiteState
    readonly roomState : RoomState
}

const initialSiteState :SiteState = {
    user : AnonymousUser,
}
var initialRoomState:RoomState = {
    needToAuth : false,
    notifications : [],
    participants : {},
    onlineUsers : {},
    boardViewState : {
        hands : [],
        selectedRobot : [],
        robotPosHistory : [],
    }
}
const initialState = {
    roomState : initialRoomState,
    siteState : initialSiteState,
}

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
export const selectRoomState = (state : State) => state.roomState
export const selectSiteState = (state : State) => state.siteState
export const selectRoomInfo = (state: State) => selectRoomState(state).roomInfo
export const selectGame = (state: State) => selectRoomState(state).gameState
export const selectResult = (state: State) => selectRoomState(state).resultState
export const selectBoardView = (state: State) => selectRoomState(state).boardViewState
export const selectProblem = (state: State) => selectRoomState(state).problemState

export const { addHandFromInput, resetHandFromInput, removeHandFromInput, setProblem,finishResult, selectRobot, setPoint,tellUser, joinToRoom, leaveFromRoom, finishGame,finishProblem,finishProblemFromServer, setTimeleft, startGame,
     addSubmission, setShortest, setShortestFromServer,addSubmissionFromServer, addHiddenSubmissionFromServer,
     animNext,animStop,animStart, addMySubmission ,setNeedToAuth, failedToAuth, setRoomInfo, notify, removeNotify} = slice.actions

export const isGoalSelector = createSelector(selectBoardView, state=>{
    if(state.problem === undefined || state?.robotPosHistory.length === 0) return false
    const pos = state.robotPosHistory[state.robotPosHistory.length - 1][state.problem.mainRobot]
    return state.problem.board.cells[pos.y][pos.x].goal
})
export const needToAuthSelector = createSelector(selectSelf, state=>selectRoomState(state).needToAuth)
export const notifSelector = createSelector(selectSelf, state=>selectRoomState(state).notifications)
export const viewHandsSelector = createSelector(selectSelf, state=>selectBoardView(state).hands)
export const viewProblemSelector = createSelector(selectSelf, state=>selectBoardView(state).problem)
export const submissionsSelector = createSelector(selectSelf, state=>state?.submissions)
export const selectedRobotSelector = createSelector(selectSelf, state=>state?.selectedRobot)
export const shortestSelector = createSelector(selectSelf, state=>state?.shortest)
export const resultSubsSelector = createSelector(selectSelf, state=>state?.submissions)
export const resultProblemSelector = createSelector(selectSelf, state=>state?.problem)
export const resultAnimSubSelector = createSelector(selectSelf, state=>state?.animSub)
export const resultAnimIDSelector = createSelector(selectSelf, state=>state?.animID)
export const roomInfoSelector = createSelector(selectSelf, state=>state)
export const timeLeftSelector = createSelector(selectSelf, state=>state?.timeleft)
export const onGameSelector = createSelector(selectSelf, state=>state.gameState !== undefined)
export const problemExistsSelector = createSelector(selectSelf, state => state !== undefined)
export const intervalSelector = createSelector(selectSelf, state=>state !== undefined)
export const lastMySubTimeSelector = createSelector(selectSelf, state=>{
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
            ([userID, point], _) => ({user : state.participants[parseInt(userID)] , point: point, online:state.onlineUsers[parseInt(userID)]})
        ).sort((a,b)=>b.point - a.point)
    return Object.entries(state.onlineUsers).filter(([userID,online])=>online).map(
        ([userID, online], _) => ({user : state.participants[parseInt(userID)] , point: 0, online:online})
    )
})
export const gameSlice = slice