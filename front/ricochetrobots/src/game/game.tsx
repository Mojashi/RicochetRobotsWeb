import { Pos } from "../util"
import Board, { BoardModel } from "./board"

export interface Game {
    board : BoardModel
    main_robot  :   number
    poss    :   Pos[]
}
