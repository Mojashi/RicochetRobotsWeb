import { Action, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../app/store"
import { Hands } from "../model/game/Hands"
import { Pos, PosExample } from "../model/game/Pos"
import { Problem, ProblemExample } from "../model/game/Problem"
import { OptSubSample, Submission, SubSample } from "../model/game/Submission"
import { InputReducers } from "./reducers/InputReducers"
import { GameReducers } from "./reducers/GameReducers"
import { ServerEventReducers } from "./reducers/ServerEventReducers"
import { LeaderBoardUser } from "../component/room/pane/LeaderBoard"
import { User, UserExample, UserID } from "../model/User"
import produce from "immer"

export type PointsDict = {
    [key:number] : number
}
export type ParticipantsDict = {
    [key:number] : User
}

type GameState = {
    readonly gameID : number,
    readonly points : PointsDict, // <userId, points>
    readonly participants : ParticipantsDict, // <userId, user>
    readonly interval : boolean,
}
type InputState = {
    readonly hands : Hands,
    readonly robotPosHistory : Pos[][],
    readonly selectedRobot : boolean[],
}
type ProblemState = {
    readonly problem : Problem,
    readonly timeleft? : number,
    readonly shortest? : Submission,
    readonly submissions : Submission[],
    readonly results? : Submission[],
}

export type RoomState = {
    readonly roomID : number
    readonly roomName : string
    readonly problemState? : ProblemState
    readonly inputState : InputState
    readonly gameState? : GameState
}

// const testState:RoomState = {
//     roomID :0,
//     gameID:0,
//     hands: [],
//     robotPosHistory:[[PosExample(), PosExample(),PosExample(),PosExample(),PosExample()]],
//     submissions:[OptSubSample,SubSample,SubSample],
//     shortest:OptSubSample,
//     problem:ProblemExample,
//     interval:false,
//     selectedRobot:[],
//     points: {},
//     participants : {},
// }

export const initialInputState:InputState = {
    hands : [],
    selectedRobot : [],
    robotPosHistory : [],
}
var initialState:RoomState = {
    roomID :0,
    roomName : "test_room",
    inputState : initialInputState,
}
// initialState = testState

// createSliceでreducerとactionを同時に定義
const slice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        ...ServerEventReducers,
        ...GameReducers,
        ...InputReducers,
    },
})

const selectSelf = (state : RootState) => state.game
const selectGame = (state: RootState) => state.game.gameState
const selectInput = (state: RootState) => state.game.inputState
const selectProblem = (state: RootState) => state.game.problemState

export const { addHand, resetHand, removeHand, setProblem, selectRobot, setPoint, join, leave, finishGame,finishProblem,finishProblemFromServer, setTimeleft, startGame,
     addSubmission, setShortest, setShortestFromServer,addSubmissionFromServer, addHiddenSubmissionFromServer } = slice.actions

export const handsSelector = createSelector(selectInput, state=>state.hands)
export const problemSelector = createSelector(selectProblem, state=>state?.problem)
export const submissionsSelector = createSelector(selectProblem, state=>state?.submissions)
export const selectedRobotSelector = createSelector(selectInput, state=>state.selectedRobot)
export const shortestSelector = createSelector(selectProblem, state=>state?.shortest)
export const resultSelector = createSelector(selectProblem, state=>state?.results)
export const roomIDSelector = createSelector(selectSelf, state=>state.roomID)
export const roomNameSelector = createSelector(selectSelf, state=>state.roomName)
export const timeLeftSelector = createSelector(selectProblem, state=>state?.timeleft)
export const onGameSelector = createSelector(selectSelf, state=>state.gameState !== undefined)
export const intervalSelector = createSelector(selectGame, state=>state?.interval ? true : false)
// export const webSocketSelector = createSelector(selectSelf, state=>state.webSocket)
export const possSelector = createSelector(selectInput, 
    state=> state.robotPosHistory.length > 0 ? 
        state.robotPosHistory[state.robotPosHistory.length-1] : []
)
export const leaderBoardSelector = createSelector(selectGame, state=>{
    if(state)
        return Object.entries(state.points).map(
            ([userID, point], _) => ({user : state.participants[parseInt(userID)] , point: point})
        )
    return []
})
export const gameSlice = slice