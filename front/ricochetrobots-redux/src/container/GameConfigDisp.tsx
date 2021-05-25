import React from "react"
import { useSelector } from "react-redux"
import { GameConfigDispView } from "../component/room/GameConfigDisp"
import { gameConfigSelector } from "./GameSlice"

export function GameConfig({className}:{className? : string}) {
	const gameConfig = useSelector(gameConfigSelector)
	return<>
		{gameConfig ? <GameConfigDispView className={className} gameConfig={gameConfig}/> : <></>}
	</>
}