import blackRobotImg from "./img/robot/black.png"
import blueRobotImg from "./img/robot/blue.png"
import greenRobotImg from "./img/robot/green.png"
import redRobotImg from "./img/robot/red.png"
import yellowRobotImg from "./img/robot/yellow.png"

export const API_SERVER = "localhost:3000/api"

export const Red = "red"
export const Black = "black"
export const Blue = "blue"
export const Green = "green"
export const Yellow = "yellow"

const colors = [Blue, Red, Green, Yellow, Black] as const
export type Color = typeof colors[number]

export interface Pos {
    x:number
    y:number
}

export function robotColor(idx : number) : Color {
    return colors[idx]
}

export function robotImg(color : Color){
    switch(color) {
        case Black: return blackRobotImg
        case Blue: return blueRobotImg
        case Green: return greenRobotImg
        case Red: return redRobotImg
        case Yellow: return yellowRobotImg
    } 
}