export interface Cell {
	walls : boolean[],
	goal : boolean,
}

export const EmptyCell = ()=>({walls:[false,false,false,false], goal:false}) as Cell
export const CellExample2 = {walls:[false,true,false,false], goal:false} as Cell
export const CellExample3 = {walls:[true,true,false,false], goal:false} as Cell
export const CellExample4 = {walls:[true,true,false,false], goal:true} as Cell

export const CellExampleR = () => {return {walls:[Math.random()<0.2,Math.random()<0.2,Math.random()<0.2,Math.random()<0.2], goal:Math.random()<0.1} as Cell}