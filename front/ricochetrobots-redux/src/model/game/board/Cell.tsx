import { Dir } from "../Dir"
import { Robot } from "../Robot"

export interface Cell {
	walls : boolean[],
	goal : boolean,
	mirror? : Mirror,
}

export type Mirror = {
	trans : Robot,
	side : Side,
}
export type Side = 0 | 1

var md = [1, 0, 3, 2]
var nd = [3, 2, 1, 0]

export function DoMirror(dir : Dir, mirror :Mirror) :Dir {
	if (mirror.side === 0) {
		return nd[dir]
	} else {
		return md[dir]
	}
}

export const EmptyCell = ()=>({walls:[false,false,false,false], goal:false}) as Cell
export const CellExample2 = {walls:[false,true,false,false], goal:false} as Cell
export const CellExample3 = {walls:[true,true,false,false], goal:false} as Cell
export const CellExample4 = {walls:[true,true,false,false], goal:true} as Cell

export const CellExampleR = () => {return {walls:[Math.random()<0.2,Math.random()<0.2,Math.random()<0.2,Math.random()<0.2], goal:Math.random()<0.1} as Cell}