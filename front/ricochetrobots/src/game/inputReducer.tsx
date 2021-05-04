import { eqPos, go, Pos } from "../util";
import { BoardModel } from "./board";
import { Game } from "./game";
import { Hand } from "./hand";
import { makeRobots, RobotModel } from "./robot";

export interface InputState {
    robots:RobotModel[],
    his:Pos[][],
    hands:Hand[], 
    reached:boolean
}

interface AddAction {
    type: "add",
    hand: Hand,
}

interface DeleteAction {
    type: "delete"
}

interface ClearAction {
    type: "clear"
}

interface InitAction {
    type: "init",
    pos : Pos[],
}

type InputAction = AddAction | DeleteAction | ClearAction | InitAction

export const InputReducer = (game:Game | null)=>(state:InputState, action:InputAction) => {
    if(game == null) return {robots:[], his:[], hands:[], reached:false}
    const {robots,his,hands, reached} = state
    const board = game.problem.board
    var np:Pos[] = []
    var mp:Pos
    switch(action.type){
        case "add":
            np = go(board, his[his.length-1], action.hand)
            if(eqPos(np[action.hand.robot], his[his.length-1][action.hand.robot])) return state
            mp = np[board.main_robot]
            return {robots:makeRobots(np),his: [...his,np], hands: [...hands, action.hand], reached:board.cells[mp.y][mp.x].goal}
        case "delete":
            if(hands.length === 0) return state
            var np = his[his.length - 2]
            mp = np[board.main_robot]
            return {robots:makeRobots(np),his:his.slice(0,his.length-1), hands:hands.slice(0,hands.length-1), reached:board.cells[mp.y][mp.x].goal}
        case "init":
            return {robots:makeRobots(action.pos), his:[action.pos], hands:[], reached:false}
        case "clear":
            return {robots:makeRobots(his[0]), his:[his[0]], hands:[], reached:false}
        default:
            return state
    }
}