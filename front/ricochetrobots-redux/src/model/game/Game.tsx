import { Problem, ProblemExample } from "./Problem"

import { Submission } from "./Submission"

export default interface Game {
	id : number,
	problem : Problem,
	submissions : Submission[],
	onGame : boolean,
	onFinishing : boolean,
	interval : number,
	timelimit : number,
}

export const GameExample = {
	id: 0,
	problem: ProblemExample,
	submissions:[],
	onGame:true,
	onFinishing:false,
	interval:10,
	timelimit:10,
} as Game