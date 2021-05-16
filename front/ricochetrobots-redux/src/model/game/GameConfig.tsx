import { Rule } from "./Rule";

export type GameConfig = {
    rule : Rule,
    timeLimit : number,
    goalPoint : number,
    pointForFirst : number,
    pointForOther : number,
    solLenMin : number,
    solLenMax : number,
}