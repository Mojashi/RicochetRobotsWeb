import { useEffect, useState } from "react"
import { BoardModel } from "./game/board"
import { Game } from "./game/game"
import { Dir, Hand, UP, LT, RT, DN } from "./game/hand"
import blackRobotImg from "./img/robot/black.png"
import blueRobotImg from "./img/robot/blue.png"
import greenRobotImg from "./img/robot/green.png"
import redRobotImg from "./img/robot/red.png"
import yellowRobotImg from "./img/robot/yellow.png"
import User from "./shared/user"

export const API_SERVER = "api"

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

function dirIdx(dir: Dir) : number {
	switch (dir) {
	case UP:
		return 0
	case RT:
		return 1
	case DN:
		return 2
	case LT:
		return 3
	}
	return 0
}

function dirVec(dir : Dir) : Pos {
	switch (dir) {
	case UP:
		return {x: 0, y: -1}
	case RT:
		return {x: 1, y: 0}
	case DN:
		return {x: 0, y: 1}
	case LT:
		return {x: -1, y: 0}
	}

	// log.Fatal("invalid dir " + dir)
	return {x: 0, y: -1}
}

export function addPos(p :Pos, v :Pos) :Pos {
	return {x: v.x + p.x, y: v.y + p.y}
}
export function eqPos(a : Pos, b : Pos) : boolean {
    return a.x === b.x && a.y === b.y
}

function canGo(board : BoardModel, poss : Pos[], robot : number, dir : Dir) : boolean {
	const nex = addPos(poss[robot], dirVec(dir))
	if (nex.x >= board.width || nex.y >= board.height || nex.x < 0 || nex.y < 0) {
		return false
    }
    for(var i = 0; poss.length > i; i++ ){
        const pos = poss[i]
		if (eqPos(pos, nex)) {
			return false
		}
    }
	return !board.cells[poss[robot].y][poss[robot].x].walls[dirIdx(dir)]
}

export function go(board:BoardModel, poss:Pos[], hand:Hand) : Pos[] {
	const ret = poss.slice()
	const vec = dirVec(hand.dir)
	while(canGo(board, ret, hand.robot, hand.dir)) {
		var nex = addPos(ret[hand.robot], vec)
		ret[hand.robot] = nex
	}
	return ret
}

export function simulate({board:board, poss:poss, main_robot:main_robot} : Game, hands : Hand[]) : Pos[][] {
	var curPos = poss.slice()
	var history:Pos[][] = [curPos.slice()]

    hands.forEach((hand) => {
		curPos = go(board, curPos, hand)
		history.push(curPos)
    })

    return history
}

export async function fetchMeAPI() : Promise<User> {
    var u = fetch(API_SERVER + "/me")
    .then((res) => {
		if(!res.ok){
		  throw new Error(res.statusText);
		}
		return res.json()
	})
    .then((data) => data as User)
    .catch((err) => {throw err});
    return await u
}


export function useKeyPress(targets : string[]) {
	// State for keeping track of whether key is pressed
	const [pressed, setPressed] = useState<Set<string>>(new Set<string>())
  
	// If pressed key is our target key then set to true
	function downHandler({key}:{key:string}) {
		// console.log(key)
		if(targets.includes(key)){
			var np = new Set(pressed)
			np.add(key)
			setPressed(np)
		}
	}
  
	// If released key is our target key then set to false
	const upHandler = ({ key }:{key:string}) => {
		if(targets.includes(key)){
		var np = new Set(pressed)
		np.delete(key)
		setPressed(np)
		}
	};
  
	// Add event listeners
	useEffect(() => {
	  window.addEventListener('keydown', downHandler);
	  window.addEventListener('keyup', upHandler);
	  // Remove event listeners on cleanup
	  return () => {
		window.removeEventListener('keydown', downHandler);
		window.removeEventListener('keyup', upHandler);
	  };
	}, []); // Empty array ensures that effect is only run on mount and unmount
  
	return pressed;
  }