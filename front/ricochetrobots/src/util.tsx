import blackRobotImg from "./Game/img/robot/black.png"
import blueRobotImg from "./Game/img/robot/blue.png"
import greenRobotImg from "./Game/img/robot/green.png"
import redRobotImg from "./Game/img/robot/red.png"
import yellowRobotImg from "./Game/img/robot/yellow.png"

const colors = ['black', 'blue', 'green', 'red', 'yellow'] as const
export type Color = typeof colors[number]

export function robotImg(color : Color){
    switch(color) {
        case 'black': return blackRobotImg
        case 'blue': return blueRobotImg
        case 'green': return greenRobotImg
        case 'red': return redRobotImg
        case 'yellow': return yellowRobotImg
    } 
}