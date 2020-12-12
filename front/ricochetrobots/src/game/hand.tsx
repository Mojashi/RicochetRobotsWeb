import {Color} from "../util"

//Dir 方向　上下左右
export type Dir = string

export const UP: Dir = "up"
export const RT: Dir = "rt"
export const DN: Dir = "dn"
export const LT: Dir = "lt"

export interface Hand {
	robot: number
    dir :  Dir
}
