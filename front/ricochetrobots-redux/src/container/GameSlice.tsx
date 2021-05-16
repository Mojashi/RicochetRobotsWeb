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
import { SiteReducers } from "./reducers/SiteReducers"
import { AnimReducers } from "./reducers/AnimReducers"

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

    readonly hint : Hands
    readonly hintPlaying : boolean
}
export type ProblemResultState = {
    readonly problem : Problem
    readonly submissions? : ResultSubmission[]

    readonly animSub? : ResultSubmission
    readonly readyNext : boolean
}

export type GameResultState = {
    readonly leaderboard : LeaderBoardUser[]
}

export type AnimState = {
    readonly frame? : number
    readonly hands? : Hands
    readonly id : number
    readonly controller? : BoardViewController,
}
export type BoardViewController = "presult" | "hint" | "input"

export const initAnimState = {
    frame :undefined,
    hands : undefined,
    id : 0,
}

export type BoardViewState = {
    readonly problem? : Problem
    readonly hands : Hands
    readonly selectedRobot : boolean[]
    readonly robotPosHistory : Pos[][]

    readonly animState : AnimState
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
    readonly problemResultState? : ProblemResultState
    readonly gameResultState? : GameResultState
}

export type State = {
    readonly siteState : SiteState
    readonly roomState : RoomState
}

export const initialSiteState :SiteState = {
    user : AnonymousUser,
}
export var initialRoomState:RoomState = {
    needToAuth : false,
    notifications : [],
    participants : {},
    onlineUsers : {},
    boardViewState : {
        hands : [],
        selectedRobot : [],
        robotPosHistory : [],
        animState:initAnimState,
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
        ...SiteReducers,
        ...AnimReducers,
    },
})

export const getRoomState = (state : Draft<State>) => state.roomState
export const getSiteState = (state : Draft<State>) => state.siteState
export const getRoomInfo = (state: Draft<State>) => getRoomState(state).roomInfo
export const getGameState = (state: Draft<State>) => getRoomState(state).gameState
export const getProblemResultState = (state: Draft<State>) => getRoomState(state).problemResultState
export const getGameResultState = (state: Draft<State>) => getRoomState(state).gameResultState
export const getBoardViewState = (state: Draft<State>) => getRoomState(state).boardViewState
export const getProblemState = (state: Draft<State>) => getRoomState(state).problemState


const selectSelf = (state : RootState) => state.game
const selectSiteState = (state : RootState) => selectSelf(state).siteState
const selectRoomState = (state : RootState) => selectSelf(state).roomState
const selectBoardViewState = (state : RootState) => selectRoomState(state).boardViewState
const selectProblemState = (state : RootState) => selectRoomState(state).problemState
const selectProblemResultState = (state : RootState) => selectRoomState(state).problemResultState
const selectGameResultState = (state : RootState) => selectRoomState(state).gameResultState
const selectGameState = (state : RootState) => selectRoomState(state).gameState
const selectRoomInfoState = (state : RootState) => selectRoomState(state).roomInfo

export const { addHandFromInput, resetHandFromInput, removeHandFromInput, setProblem,finishResult, selectRobot, setPoint,tellUser, joinToRoom, leaveFromRoom, finishGame,finishProblem,finishProblemFromServer, setTimeleft, startGame,
     addSubmission,setHint, setShortest, setShortestFromServer,addSubmissionFromServer, addHiddenSubmissionFromServer,
     animNext,animStop,animStart,playHint,stopHint, playResultSub,stopResultSub, addMySubmission,setReadyNext, setUser,quitRoom, setGameResult ,setNeedToAuth, failedToAuth, setRoomInfo, notify, removeNotify} = slice.actions

export const isGoalSelector = createSelector(selectBoardViewState, state=>{
    if(state.problem === undefined || state?.robotPosHistory.length === 0) return false
    const pos = state.robotPosHistory[state.robotPosHistory.length - 1][state.problem.mainRobot]
    return state.problem.board.cells[pos.y][pos.x].goal
})
export const loggedInSelector = createSelector(selectSiteState, state=>state.user.id !== AnonymousUser.id)
export const userSelector = createSelector(selectSiteState, state=>state.user)
export const hintPlayingSelector = createSelector(selectProblemState, state=>state?.hintPlaying)
export const isAdminSelector = createSelector(selectSelf, state=>state.siteState.user.id === state.roomState.roomInfo?.admin.id)
export const needToAuthSelector = createSelector(selectRoomState, state=>state.needToAuth)
export const notifSelector = createSelector(selectRoomState, state=>state.notifications)
export const viewHandsSelector = createSelector(selectBoardViewState, state=>state.hands)
export const viewProblemSelector = createSelector(selectBoardViewState, state=>state.problem)
export const submissionsSelector = createSelector(selectProblemState, state=>state?.submissions)
export const selectedRobotSelector = createSelector(selectBoardViewState, state=>state?.selectedRobot)
export const shortestSelector = createSelector(selectProblemState, state=>state?.shortest)
export const gameResultSelector = createSelector(selectGameResultState, state=>state?.leaderboard)
export const showGameResultSelector = createSelector(selectRoomState, state=>state.gameResultState !== undefined && state.problemResultState === undefined)
export const resultSubsSelector = createSelector(selectProblemResultState, state=>state?.submissions)
export const resultProblemSelector = createSelector(selectProblemResultState, state=>state?.problem)
export const resultAnimSubSelector = createSelector(selectProblemResultState, state=>state?.animSub)
export const animIDSelector = createSelector(selectBoardViewState, state=>state?.animState?.id)
export const roomInfoSelector = createSelector(selectRoomInfoState, state=>state)
export const readyNextSelector = createSelector(selectProblemResultState, state=>state?.readyNext)
export const onGameSelector = createSelector(selectGameState, state=>state !== undefined)
export const hintSelector = createSelector(selectProblemState, state=>state?.hint)
export const gameConfigSelector = createSelector(selectRoomInfoState, state=>state?.gameConfig)
export const problemExistsSelector = createSelector(selectProblemState, state => state !== undefined)
export const intervalSelector = createSelector(selectProblemResultState, state=>state !== undefined)
export const lastMySubTimeSelector = createSelector(selectProblemState, state=>{
    const len = state?.mySubmissions.length
    if(state && len !== undefined && len > 0) return state.mySubmissions[len - 1].timeStamp
    else return 0 
})
export const inputAcceptableSelector = createSelector(selectRoomState, state=>state.problemResultState === undefined && state.problemState !== undefined )
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