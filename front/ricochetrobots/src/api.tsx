import { BoardModel } from "./Game/Board";
import { PlayerModel } from "./Game/Player";

const API_SERVER = "localhost:3000"

export class ArenaGameInfo{
    board : BoardModel
    players : PlayerModel[]
    timelimit : number

    constructor(){
        this.players = []
        this.board = new BoardModel(0,0)
        this.timelimit = 0
    }
}

export function fetchArenaGame() : ArenaGameInfo {
    return new ArenaGameInfo()
}