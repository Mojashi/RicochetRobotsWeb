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
import produce, { Draft } from "immer"
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

export type SiteState = {
    user : User,
}

export type GameState = {
    readonly gameID : number
    readonly points : PointsDict // <userId, points>
}

export type ProblemState = {
    readonly problem : Problem
    readonly timeleft? : number
    readonly shortest? : Submission
    readonly submissions : Submission[]
    readonly mySubmissions : MySubmission[]
}
export type ResultState = {
    readonly problem : Problem
    readonly submissions? : ResultSubmission[]

    readonly animFrame? : number
    readonly animSub? : ResultSubmission
    readonly animID : number
}

export type BoardViewState = {
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

export const getRoomState = (state : Draft<State>) => state.roomState
export const getSiteState = (state : Draft<State>) => state.siteState
export const getRoomInfo = (state: Draft<State>) => getRoomState(state).roomInfo
export const getGameState = (state: Draft<State>) => getRoomState(state).gameState
export const getResultState = (state: Draft<State>) => getRoomState(state).resultState
export const getBoardViewState = (state: Draft<State>) => getRoomState(state).boardViewState
export const getProblemState = (state: Draft<State>) => getRoomState(state).problemState


const selectSelf = (state : RootState) => state.game
const selectRoomState = (state : RootState) => selectSelf(state).roomState
const selectBoardViewState = (state : RootState) => selectRoomState(state).boardViewState
const selectProblemState = (state : RootState) => selectRoomState(state).problemState
const selectResultState = (state : RootState) => selectRoomState(state).resultState
const selectGameState = (state : RootState) => selectRoomState(state).gameState
const selectRoomInfoState = (state : RootState) => selectRoomState(state).roomInfo

export const { addHandFromInput, resetHandFromInput, removeHandFromInput, setProblem,finishResult, selectRobot, setPoint,tellUser, joinToRoom, leaveFromRoom, finishGame,finishProblem,finishProblemFromServer, setTimeleft, startGame,
     addSubmission, setShortest, setShortestFromServer,addSubmissionFromServer, addHiddenSubmissionFromServer,
     animNext,animStop,animStart, addMySubmission ,setNeedToAuth, failedToAuth, setRoomInfo, notify, removeNotify} = slice.actions

export const isGoalSelector = createSelector(selectBoardViewState, state=>{
    if(state.problem === undefined || state?.robotPosHistory.length === 0) return false
    const pos = state.robotPosHistory[state.robotPosHistory.length - 1][state.problem.mainRobot]
    return state.problem.board.cells[pos.y][pos.x].goal
})
export const needToAuthSelector = createSelector(selectRoomState, state=>state.needToAuth)
export const notifSelector = createSelector(selectRoomState, state=>state.notifications)
export const viewHandsSelector = createSelector(selectBoardViewState, state=>state.hands)
export const viewProblemSelector = createSelector(selectBoardViewState, state=>state.problem)
export const submissionsSelector = createSelector(selectProblemState, state=>state?.submissions)
export const selectedRobotSelector = createSelector(selectBoardViewState, state=>state?.selectedRobot)
export const shortestSelector = createSelector(selectProblemState, state=>state?.shortest)
export const resultSubsSelector = createSelector(selectResultState, state=>state?.submissions)
export const resultProblemSelector = createSelector(selectResultState, state=>state?.problem)
export const resultAnimSubSelector = createSelector(selectResultState, state=>state?.animSub)
export const resultAnimIDSelector = createSelector(selectResultState, state=>state?.animID)
export const roomInfoSelector = createSelector(selectRoomInfoState, state=>state)
export const onGameSelector = createSelector(selectGameState, state=>state !== undefined)
export const problemExistsSelector = createSelector(selectProblemState, state => state !== undefined)
export const intervalSelector = createSelector(selectResultState, state=>state !== undefined)
export const lastMySubTimeSelector = createSelector(selectProblemState, state=>{
    const len = state?.mySubmissions.length
    if(state && len !== undefined && len > 0) return state.mySubmissions[len - 1].timeStamp
    else return 0 
})
export const inputAcceptableSelector = createSelector(selectRoomState, state=>state.resultState === undefined && state.problemState !== undefined )
// export const webSocketSelector = createSelector(selectSelf, state=>state.webSocket)
export const possSelector = createSelector(selectBoardViewState, state=>{
    if(state.robotPosHistory.length > 0) return state.robotPosHistory[state.robotPosHistory.length-1]
    else return []
})
export const leaderBoardSelector = createSelector(selectRoomState, state=>{
    if(state.gameState)
        return Object.entries(state.gameState.points).map(
            ([userID, point], _) => ({user : state.participants[parseInt(userID)] , point: point, online:state.onlineUsers[parseInt(userID)]})
        ).sort((a,b)=>b.point - a.point)
    return Object.entries(state.onlineUsers).filter(([userID,online])=>online).map(
        ([userID, online], _) => ({user : state.participants[parseInt(userID)] , point: 0, online:online})
    )
})
export const gameSlice = slice