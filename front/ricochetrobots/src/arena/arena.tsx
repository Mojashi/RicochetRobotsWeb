import Board, {BoardModel} from "../game/board"
import {PlayerModel} from "../game/player"
import {useState, useEffect, useRef} from "react"
import styled from "styled-components"
import {API_SERVER} from "../util"
import {ServerEvent} from "./server_events"
import {ClientEvent} from "./client_events"
import HandsInput from "../shared/hands_input"
import { Hand } from "../game/hand"

const CenterBox = styled("div")`
    position:absolute;
    top: 50%;
    left:50%;
    transform : translate(-50%, -50%);
`

function Arena() {
    var [board, setBoard] = useState(new BoardModel(10, 10))
    var [rectSize, setRectSize] = useState( [0,0] )
    var bBox = useRef<HTMLDivElement>(null)

    const ws = useRef<WebSocket|null>(null);

    const procServerEvent = (event:ServerEvent) => {
        if(event.finish){
            console.log("event:finish")
        }
        if(event.join){
            console.log("event:join")
            console.log(event.join.name)
        }
        if(event.leave){
            console.log("event:leave")
            console.log(event.leave.name)
        }
        if(event.start){
            console.log("event:start")
            console.log("until:",event.start.finishdate)
            setBoard(event.start.board)
        }
        if(event.submit){
            console.log("event:submit")
            console.log(event.submit.hands)
        }
    }
    const handleSubmit = (hands : Hand[]) => {
        if(hands.length == 0) return;
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

    var cellSize = Math.min(rectSize[0] / board.height, rectSize[1] / board.width)
    
    var [players, setPlayers] = useState([new PlayerModel("blue", [0,0])])
    
    return (
        <div ref={bBox} style={{width:"80%", height:"80%"}}>
        <CenterBox>
        <Board board={board} cellSize={cellSize} players={players}/>
        <HandsInput onSubmit={handleSubmit}/>
        </CenterBox>
        </div>
    );
}

export default Arena;