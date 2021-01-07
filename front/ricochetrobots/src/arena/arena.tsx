import Board, {BoardModel} from "../game/board"
import {RobotModel} from "../game/robot"
import {useState, useEffect, useRef, useReducer} from "react"
import styled from "styled-components"
import {API_SERVER, compSub, eqPos, go, Pos, simulate} from "../util"
import {ServerEvent} from "./server_events"
import {ClientEvent, SubmitCEvent} from "./client_events"
import HandsInput from "../shared/hands_input"
import { Hand } from "../game/hand"
import SubRanking, {SubmissionModel} from "../shared/subrank"
import {Game} from "../game/game"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { fetchMe, userState } from "../recoil_states"

const CenterBox = styled("div")`
    position:absolute;
    top: 50%;
    left:50%;
    transform : translate(-50%, -50%);
    display:flex;
    flex-wrap:nowrap;
    width:100%;
    justify-content:space-evenly;
    height:100%;
`

const ArenaBox = styled("div")`
    position:absolute;
    top: 50%;
    left:50%;
    transform : translate(-50%, -50%);
    width:90%;
    height:90%;
`

const Screen = styled("div")`
    position:fixed;
    width:100%;
    height:100%;
    left:0;
    top:0;
    background-color:rgba(0,0,0,0.2);
    z-index:100000;
`

function assignRobotsPos(poss:Pos[]):RobotModel[]{
    return poss.map((pos, idx) => ({pos:pos, idx:idx} as RobotModel))
}

function Arena() {
    const [game_id, setGameId] = useState<number>(-1)
    const [game, setGame] = useState<Game>()
    const [subs , setSubs] = useState<SubmissionModel[]>([]) 
    const [rectSize, setRectSize] = useState( [0,0] )
    const user = useRecoilValue(userState)
    var bBox = useRef<HTMLDivElement>(null)
    const ws = useRef<WebSocket|null>(null);
    const [sending,setSending] = useState<boolean>(false)
    const [animSubs, setAnimSubs] = useState<number[]>([])

    const [inputState, inputDispatch] = useReducer((state:{robots:RobotModel[], his:Pos[][], hands:Hand[], reached:boolean}, action:any) => {
        if(game === undefined) return state
        const {robots,his,hands, reached} = state
        var np:Pos[] = []
        var mp:Pos
        switch(action.type){
            case "add":
                np = go(game.board, his[his.length-1], action.hand)
                // his.push(np)
                if(eqPos(np[action.hand.robot], his[his.length-1][action.hand.robot])) return state
                mp = np[game.main_robot]
                return {robots:assignRobotsPos(np),his: [...his,np], hands: [...hands, action.hand], reached:game.board.cells[mp.y][mp.x].goal}
            case "del":
                if(hands.length === 0) return state
                var np = his[his.length - 2]
                // his.pop()
                mp = np[game.main_robot]
                return {robots:assignRobotsPos(np),his:his.slice(0,his.length-1), hands:hands.slice(0,hands.length-1), reached:game.board.cells[mp.y][mp.x].goal}
            case "init":
                return {robots:assignRobotsPos(action.pos), his:[action.pos], hands:[], reached:false}
            case "clear":
                return {robots:assignRobotsPos(his[0]), his:[his[0]], hands:[], reached:false}
            default:
                return state
        }
    }, {robots:[], his:[], hands:[], reached:false})

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
            setSubs(event.start.subs.slice(0,Math.min(event.start.subs.length, 5)))
            setGame(g)
            inputDispatch({type:"init", pos:g.poss}) // ここめちゃくちゃ怪しいね
            setGameId(event.start.game_id)
            // setBoard(event.start.game.board)
        }
        if(event.submit){
            console.log("event:submit")
            const sub = event.submit.sub
            if(sub.user.id === user?.id){
                if(sub.opt){
                console.log("optimal")
                }
                setSending(false)
            }

            setAnimSubs(s=>{
                const ss = s.slice()
                ss.push(sub.id)
                return ss
            })

            setSubs(subs => {
                console.log(subs)
                var nsubs = subs.slice()
                nsubs.push(sub)
                return nsubs.sort(compSub).slice(0, Math.min(nsubs.length, 5))
            })
        }
    }

    const handleSubmit = () => {
        const hands = inputState.hands
        if(hands.length === 0) return;
        if(!ws.current)return; 
        setSending(true)
        var ev:SubmitCEvent = {game_id: game_id, hands:hands}
        ws.current.send(JSON.stringify({submit:ev}))
        console.log("submit:" + JSON.stringify({submit:ev}))
    }


    useEffect(() => {
        ws.current = new WebSocket(`ws://localhost:3000/${API_SERVER}/arena/ws`)
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
            setSending(false)
            
            if(ws.current !== null){
                ws.current.close();
            }
        };
    }, [user]);

    // useEffect(() => {
    //     if (!ws.current) return;

    // }, [ws]);
    
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
    const sq = Math.min(rectSize[0], rectSize[1])
    const cellSize = game ? Math.min(rectSize[0] / game.board.height, rectSize[1] / game.board.width):0
    return (
        <ArenaBox ref={bBox}>
        {/* <Screen>aaa</Screen> */}
        <CenterBox>
        <div style={{width:`20%`, margin:"1vw"}}>
            <SubRanking subs = {subs} animate={animSubs}/>
        </div>
        <div style={{width:`${sq}px`, position:"relative"}}>
            {game && <Board board={game.board} cellSize={cellSize} robots={inputState.robots} mainRobot={game.main_robot}/>}
        </div>
        {/* <div style={{width:`${(rectSize[1] - sq)/2}px`}}> */}
        <HandsInput disabled={inputState.reached} onSubmit={handleSubmit} addHand={(hand)=>{inputDispatch({type:"add",hand:hand})}} rmHand={()=>{inputDispatch({type:"del"})}} clearHands={()=>{inputDispatch({type:"clear"})}} hands={inputState.hands} sending={sending}/>
        {/* </div> */}
        </CenterBox>
        </ArenaBox>
    );
}

export default Arena;