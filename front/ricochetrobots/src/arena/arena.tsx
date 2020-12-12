import Board, {BoardModel} from "../game/board"
import {RobotModel} from "../game/robot"
import {useState, useEffect, useRef} from "react"
import styled from "styled-components"
import {API_SERVER} from "../util"
import {ServerEvent} from "./server_events"
import {ClientEvent} from "./client_events"
import HandsInput from "../shared/hands_input"
import { Hand } from "../game/hand"
import SubRanking, {SubmissionModel} from "../shared/subrank"
import {Game} from "../game/game"

const CenterBox = styled("div")`
    position:absolute;
    top: 50%;
    left:50%;
    transform : translate(-50%, -50%);
`

const ArenaBox = styled("div")`
    position:absolute;
    top: 50%;
    left:50%;
    transform : translate(-50%, -50%);
    width:80%;
    height:80%;
`

function Arena() {
    // var [board, setBoard] = useState(new BoardModel(10, 10))
    const [game, setGame] = useState<Game>()
    const [robots, setRobots] = useState<RobotModel[]>([])
    const [subs , setSubs] = useState<SubmissionModel[]>([]) 
    const [rectSize, setRectSize] = useState( [0,0] )
    var bBox = useRef<HTMLDivElement>(null)

    const ws = useRef<WebSocket|null>(null);

    const procServerEvent = (event:ServerEvent) => {
        if(event.finish){
            console.log("event:finish")
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
            console.log("until:",event.start.finishdate)
            const g = event.start.game
            var tmp:RobotModel[] = []
            for(var i = 0; g.poss.length > i; i++){
                tmp.push({pos:g.poss[i], idx:i})
            }
            setGame(g)
            setRobots(tmp)
            // setBoard(event.start.game.board)
        }
        if(event.submit){
            console.log("event:submit")
            const sub = event.submit.sub

            setSubs(subs => {
                var nsubs = subs.slice(0, Math.min(subs.length, 4))
                nsubs.push(sub)
                return nsubs
            })
        }
    }
    const handleSubmit = (hands : Hand[]) => {
        if(hands.length === 0) return;
        if(!ws.current)return; 
        ws.current.send(JSON.stringify({submit:{hands:hands}}))
        console.log(hands)
        console.log(JSON.stringify({submit:{hands:hands}}))
    }


    useEffect(() => {
        ws.current = new WebSocket(`ws://${API_SERVER}/arena/ws`)
        ws.current.onopen = () => console.log("ws opened")
        ws.current.onclose = () => console.log("ws closed")

        return () => {
            if(!ws.current)
                ws.current!.close();
        };
    }, []);

    useEffect(() => {
        if (!ws.current) return;

        ws.current.onmessage = e => {
            try{
                console.log("received:"+e.data)
                const event:ServerEvent = JSON.parse(e.data, function(k,v){if(k === "finishdate") return new Date(v); else return v});
                procServerEvent(event)
            }catch (err){
                console.error(err)
            }
        };
    }, []);
    
    useEffect( () => {
        if(bBox.current)
            setRectSize([bBox.current.offsetHeight,bBox.current!.offsetWidth])
    }, [bBox]);

    useEffect(() => {
        function handleResize() {
            if(bBox.current)
                setRectSize([bBox.current.offsetHeight,bBox.current!.offsetWidth])
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
      }, []);
    
    const cellSize = game ? Math.min(rectSize[0] / game.board.height, rectSize[1] / game.board.width):0
    return (
        <ArenaBox ref={bBox}>
        <SubRanking subs = {subs}/>
        <CenterBox>
        {game && <Board board={game.board} cellSize={cellSize} robots={robots} mainRobot={game.main_robot}/>}
        <HandsInput onSubmit={handleSubmit}/>
        </CenterBox>
        </ArenaBox>
    );
}

export default Arena;