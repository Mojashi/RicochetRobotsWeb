import { Dir, dirToIdx, dirToVec, DN, invDir, LT, RT, UP } from "../Dir";
import { Pos } from "../Pos";
import { Robot } from "../Robot";
import { Cell, EmptyCell, CellExampleR } from "./Cell"

//ボード
export default interface Board {
	height : number,
	width : number,   
	cells : Cell[][],
}

export const EmptyBoard : Board = {
	height : 16,
	width: 16,
	cells : Array.from({length:16}, a=>Array.from({length:16},_=>EmptyCell())),
}

const makeCells = ()=> {
	const cells = Array.from({length:16}, a=>Array.from({length:16},_=>EmptyCell()))
	for(let i = 0; i < 16; i++)
	for(let j = 0; j < 16; j++)
	for(let k of [UP,RT,LT,DN]){
		if(Math.random() < 0.1){
			cells[i][j].walls[dirToIdx(k)] = true
			const vec = dirToVec(k)
			const next = {y:i + vec.y, x : j + vec.x}
			if(next.x >= 16 || next.x < 0 || next.y >= 16 || next.y < 0) continue
			cells[next.y][next.x].walls[dirToIdx(invDir(k))] = true
		}
	}

	return cells
}

export const BoardExample : Board = {
	height : 16,
	width:16,
	cells : makeCells(),
}

export function moveRobot(board : Board, robotPoss : Pos[], mainRobot : Robot, dir : Dir) {
	var changed = false
	while(true){
		const vec = dirToVec(dir)
		const next = {x:robotPoss[mainRobot].x + vec.x, y:robotPoss[mainRobot].y + vec.y}

		if(next.x >= board.width || next.x < 0 || next.y >= board.height || next.y < 0) break
		if(board.cells[robotPoss[mainRobot].y][robotPoss[mainRobot].x].walls[dirToIdx(dir)]) break
		if(robotPoss.some(p=>(p.x === next.x && p.y === next.y))) break
		robotPoss[mainRobot] = next;
		changed = true
	}
	return changed
}