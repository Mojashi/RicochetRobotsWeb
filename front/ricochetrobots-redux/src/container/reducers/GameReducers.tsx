import { Action, PayloadAction } from "@reduxjs/toolkit"
import { Hand } from "../../model/game/Hand"
import {current, Draft, produce} from "immer"
import { moveRobot } from "../../model/game/board/Board"
import {RoomState, initialInputState} from "../GameSlice"
import { Problem } from "../../model/game/Problem"
import { OptSubSample, Submission, SubSample } from "../../model/game/Submission"
import Game from "../../model/game/Game"
import { UnknownUser, User, UserExample, UserID } from "../../model/User"

export const setProblemFunc = (draft : Draft<RoomState>, problem : Problem)=> {
    if(draft.gameState) {
        draft.problemState = {
            problem: problem,
            submissions : [],
        }
        draft.inputState = {
            hands : [],
            robotPosHistory : [problem.robotPoss],
            selectedRobot :Array.from({length:problem.numRobot},()=>false), 
        } 
        draft.gameState.interval = false
    }
}
export const setShortestFunc = (draft : Draft<RoomState>, sub : Submission)=> {
    if(draft.problemState)
        draft.problemState.shortest = sub
}
export const addSubmissionFunc = (draft : Draft<RoomState>, sub : Submission)=> {
    draft.problemState?.submissions.push(sub)
}
export const joinFunc = (draft : Draft<RoomState>, user : User)=> {
    if(draft.gameState === undefined){
        draft.gameState = {
            gameID : 0,
            points: {},
            participants: {},
            interval: false,
        }
    }
    if(draft.gameState){
        draft.gameState.participants[user.id] = user
        if(!draft.gameState.points.hasOwnProperty(user.id))
            draft.gameState.points[user.id] = 0
    }
}
export const leaveFunc = (draft : Draft<RoomState>, userID : UserID)=> {
    // draft.participants.delete(userID)
}
export const setPointFunc = (draft : Draft<RoomState>, userID : UserID, point : number)=> {
    if(draft.gameState){
        draft.gameState.points[userID] = point
        if(!draft.gameState.participants.hasOwnProperty(userID)){
            draft.gameState.participants[userID] = UnknownUser
        }
    }
}

export const finishProblemFunc = (draft : Draft<RoomState>, subs : Submission[])=> {
    if(draft.problemState){
        draft.problemState.results = subs

        draft.problemState.timeleft = undefined
        draft.gameState!!.interval = true
        draft.inputState = initialInputState
    }
}

export const GameReducers = {
    setProblem: (state:RoomState, action : PayloadAction<Problem>) => (
        produce(state, draft => setProblemFunc(draft, action.payload))
    ),
    addSubmission: (state:RoomState, action : PayloadAction<Submission>) => (
        produce(state, draft => addSubmissionFunc(draft, action.payload))
    ),
    setShortest: (state:RoomState, action : PayloadAction<Submission>) => (
        produce(state, draft => setShortestFunc(draft, action.payload))
    ),
    join: (state:RoomState, action : PayloadAction<User>) => (
        produce(state, draft => joinFunc(draft, action.payload))
    ),
    leave: (state:RoomState, action : PayloadAction<UserID>) => (
        produce(state, draft => leaveFunc(draft, action.payload))
    ),
    setPoint: (state: RoomState, action : PayloadAction<{userID:UserID, point:number}>) => (
        produce(state, draft => setPointFunc(draft, action.payload.userID, action.payload.point))
    ),
    setTimeleft: (state : RoomState, action : PayloadAction<number>) => (
        produce(state, draft => {
            if(draft.problemState)
                draft.problemState.timeleft = action.payload
        })
    ),
    finishGame: (state : RoomState, action : Action) => (
        produce(state, draft => {
            draft.problemState = undefined
            draft.gameState = undefined
            draft.inputState = initialInputState
        })
    ),
    finishProblem: (state : RoomState, action : PayloadAction<Submission[]>) => (
        produce(state, draft => finishProblemFunc(draft, action.payload))
    ),
    startGame: (state : RoomState, action : PayloadAction<number>) => (
        produce(state, draft => {
            if (draft.gameState === undefined || draft.gameState?.gameID !== action.payload) {
                draft.gameState = {
                    gameID : action.payload,
                    points : {},
                    participants : {},
                    interval : true,
                }
            }
        })
    )
}