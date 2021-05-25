import Board, {BoardExample} from "./board/Board"
import { Pos, PosExample } from "./Pos"
import { Robot } from "./Robot"

// 問題一つを表現
export interface Problem {
	id : number,
	board : Board,
	mainRobot : Robot,
	robotPoss : Pos[],
	numRobot : number,
}
export const ProblemExample = {
	id:0,
	board:BoardExample,
	mainRobot:0,
	robotPoss:[PosExample(),PosExample(),PosExample(),PosExample(),PosExample()],
	numRobot:5,
} as Problem