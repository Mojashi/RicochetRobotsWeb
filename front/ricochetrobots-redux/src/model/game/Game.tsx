import { Problem, ProblemExample } from "./Problem";
import { Rule, TestRule } from "./Rule";
import { Submission } from "./Submission";

export default interface Game {
    id : number,
    rule : Rule,
    problem : Problem,
    submissions : Submission[],
    onGame : boolean,
    onFinishing : boolean,
    interval : number,
    timelimit : number,
}

export const GameExample = {
    id: 0,
    rule : TestRule,
    problem: ProblemExample,
    submissions:[],
    onGame:true,
    onFinishing:false,
    interval:10,
    timelimit:10,
} as Game