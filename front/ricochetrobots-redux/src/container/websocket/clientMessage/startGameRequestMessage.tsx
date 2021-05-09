import { GameConfig } from "../../../model/game/GameConfig"
import { ClientMessage, CStart, CSubmit, MessageType } from "../WebsocketEventHandler"

export class StartGameRequestMessage implements ClientMessage {
    type:MessageType = CStart
    gameConfig : GameConfig
    constructor(gameConfig : GameConfig){
        this.gameConfig = gameConfig
    }
    toJSON(){
        return {
            type:this.type,
            gameConfig : this.gameConfig,
        }
    }
}