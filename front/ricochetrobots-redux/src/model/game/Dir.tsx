export type Dir = number

export const UP : Dir = 0
export const RT : Dir = 1
export const DN : Dir = 2
export const LT : Dir = 3

export function dirToIdx(dir : Dir) :number {
	switch(dir) {
	case UP: return 0
	case RT: return 1
	case DN: return 2
	case LT: return 3
	default: return 0
	}
}
export function invDir(dir : Dir):Dir{
	switch(dir) {
	case UP: return DN
	case RT: return LT
	case DN: return UP
	case LT: return RT
	default: return DN
	}
}
export function dirToVec(dir : Dir) {
	switch(dir) {
	case UP: return {x:0, y:-1}
	case RT: return {x:1, y:0}
	case DN: return {x:0, y:1}
	case LT: return {x:-1, y:0}
	default: return {x:0, y:-1}
	}
}

