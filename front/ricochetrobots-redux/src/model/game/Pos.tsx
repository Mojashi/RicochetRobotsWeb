export interface Pos {
	x : number,
	y : number
}

export const PosExample = ()=>{return {x : Math.floor(Math.random()*16),y : Math.floor(Math.random()*16)} as Pos}