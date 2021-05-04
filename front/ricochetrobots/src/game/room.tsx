import {useState, useEffect, useRef} from "react"
import { useRecoilValue } from "recoil"
import { userState } from "../recoil_states"
import { SubmissionModel } from "../shared/submission"
import { API_SERVER } from "../util"
import {Game,GameHandler,GameView} from "./game"
import { ServerEvent, SubmitSEvent, TimeLimitSEvent } from "./server_events"

type State = "playing" | "interval"

export default function Room(){
    const [state, setState] = useState<State>("interval")
    const [game, setGame] = useState<Game | null>(null)
    const ws = useRef<WebSocket|null>(null);
    const ref = useRef<GameHandler>(null)
    const user = useRecoilValue(userState)
    const [userPoints, setUserPoints] = useState<number[]>([]);

    const procServerEvent = (event:ServerEvent) => {
        if(event.finish){
            console.log("event:finish")
            setState("interval")
            ref.current?.finish()
        }
        if(event.join){
            console.log("event:join")
            console.log(event.join.user.name)
        }
        if(event.leave){
            console.log("event:leave")
            console.log(event.leave.user.name)
        }
        if(event.start){
            console.log("event:start")
            const g = event.start.game
            // setPlaySub(null)
            setState("playing")
            setGame(g)
        }

        //on game
        if(event.timelimit) {
            console.log("event:timelimit")
            ref.current?.timelimit(event.timelimit.rem_time)
        }
        if(event.submit){
            console.log("event:submit")
            if(game?.id == event.submit.game_id)
                ref.current?.submit(event.submit.sub)
        }
    }

    useEffect(() => {
        ws.current = new WebSocket(`ws://${document.domain}:3000/${API_SERVER}/arena/ws`)
        ws.current.onopen = () => console.log("ws opened")
        ws.current.onclose = () => console.log("ws closed")
        ws.current.onmessage = e => {
            try{
                console.log("received:"+e.data)
                const event:ServerEvent = JSON.parse(e.data, function(k,v){if(k === "finishdate") return new Date(v); else return v});
                procServerEvent(event)
            }catch (err){
                console.error(err)
            }
        };
        return () => {
            if(ws.current !== null){
                ws.current.close();
            }
        };
    }, [user]);

    return (
        <GameView game={game} ref={ref}/>
    )
}