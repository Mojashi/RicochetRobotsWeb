import { Rule } from "./Rule";

export type GameConfig = {
    rule : Rule,
    timeLimit : number,
    goalPoint : number,
    pointForFirst : number,
    pointForOther : number,
    problemConfig : ProblemConfig,
}

export type ProblemConfig = {
    solLenMin : number,
    solLenMax : number,
    torus : Choice,
    mirror : Choice,
}

export const Never = 0
export const Optional = 1
export const Required = 2
export type Choice = 0 | 1 | 2