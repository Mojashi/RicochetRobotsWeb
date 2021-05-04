import Board, {BoardModel} from "./board"
import {makeRobots, RobotModel} from "./robot"
import {useState, useEffect, useRef, useReducer} from "react"
import styled from "styled-components"
import {API_SERVER, compSub, eqPos, go, Pos, simulate} from "../util"
import {ServerEvent} from "./server_events"
import {ClientEvent, SubmitCEvent} from "./client_events"
import HandsInput from "../shared/hands_input"
import { Hand } from "./hand"
import SubRanking from "../shared/subrank"
import {SubmissionModel} from "../shared/submission"
import {Game} from "./game"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { fetchMe, userState } from "../recoil_states"
import CircleTimer from "./timer"
import FadeinBox from "../shared/FadeinBox"
import Result from "./result"
import SubTimeLine from "./timeline"
import BoardPlayer from "./boardplayer"
import { CSSTransition } from "react-transition-group"
import {SlideIn, ExpandIn} from "../shared/useful"
import BigMsg from "./BigMsg"
import { CSSProperties } from "@material-ui/core/styles/withStyles"

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
    width:100%;
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


 //     <CSSTransition {...props}>
//         {children}
//     </CSSTransition>

type State = "loading" | "playing" | "timelimit" | "showResult" |"interval"

type Msg = {msg:string, timeout : number, style : CSSProperties, onTimeout : ()=>void}

export default function Arena() {
    const [game_id, setGameId] = useState<number>(-1)
    const [game, setGame] = useState<Game|null>(null)
    const [subs , setSubs] = useState<SubmissionModel[]>([]) 
    const [rectSize, setRectSize] = useState<[number, number]>( [0,0] )
    const user = useRecoilValue(userState)
    var bBox = useRef<HTMLDivElement>(null)
    const ws = useRef<WebSocket|null>(null);
    const [sending,setSending] = useState<boolean>(false)

    const [showTimer, setShowTimer] = useState<boolean>(false)
    const [timelimit, setTimeLimit] = useState<{rem:number, onFinish:()=>void} | null>(null)
    const [state, setState] = useState<State>("loading")
    const [result, setResult] = useState<{subs:SubmissionModel[], game:Game}|null>(null)
    const [showResult, setShowResult] = useState<boolean>(false)
    const TimeUpMsg:Msg = {msg:"TIME UP",timeout:3000,style:{
            textShadow: "9px 10px darkred",
            color: "orangered"
        }, onTimeout:()=>{
        setSubs((s)=>{
            setGame((g)=>{
                if(g !== null){
                    setResult(()=>{
                        return {subs:s, game:g}
                    })
                    setShowResult(true)
                }
                return null
            })
            return []
        })
    }}
    const OptimalMsg:Msg = {
        msg:"OPTIMAL",
        timeout:2000,
        style:{
            textShadow: "9px 10px lightgreen",
            color: "lightseagreen"
       }, onTimeout:()=>{}
    }

    const WaitingMsg :Msg = {
        msg:"Wait For The NextGame",
        timeout:99999999,
        style :{
            textShadow: "9px 10px lightgreen",
            color: "lightseagreen"
        }, 
        onTimeout:()=>{}
    }
    const [msgs, setMsgs] = useState<{msg:string, style:React.CSSProperties, timeout:number, onTimeout:()=>void}[]>([])

    const [inputState, inputDispatch] = useReducer((state:{robots:RobotModel[], his:Pos[][], hands:Hand[], reached:boolean}, action:any) => {
        if(game === null) return state
        const board = game.problem.board
        const {robots,his,hands, reached} = state
        var np:Pos[] = []
        var mp:Pos
        switch(action.type){
            case "add":
                np = go(board, his[his.length-1], action.hand)
                // his.push(np)
                if(eqPos(np[action.hand.robot], his[his.length-1][action.hand.robot])) return state
                mp = np[board.main_robot]
                return {robots:makeRobots(np),his: [...his,np], hands: [...hands, action.hand], reached:board.cells[mp.y][mp.x].goal}
            case "del":
                if(hands.length === 0) return state
                var np = his[his.length - 2]
                // his.pop()
                mp = np[board.main_robot]
                return {robots:makeRobots(np),his:his.slice(0,his.length-1), hands:hands.slice(0,hands.length-1), reached:board.cells[mp.y][mp.x].goal}
            case "init":
                return {robots:makeRobots(action.pos), his:[action.pos], hands:[], reached:false}
            case "clear":
                return {robots:makeRobots(his[0]), his:[his[0]], hands:[], reached:false}
            default:
                return state
        }
    }, {robots:[], his:[], hands:[], reached:false})

    const procServerEvent = (event:ServerEvent) => {
        if(event.finish){
            console.log("event:finish")
            if(event.finish.interval !== undefined){
                // setTimeLimit({rem:event.finish.interval, onFinish:()=>{setTimeLimit(null)}})
            }
            setState("showResult")
            inputDispatch({type:"clear"})
            
            setMsgs(ms => ms.concat([TimeUpMsg]))
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
            setSubs(event.start.subs)
            setGame(g)
            inputDispatch({type:"init", pos:g.problem.board.poss}) // ここめちゃくちゃ怪しいね
            setGameId(event.start.game.id)
            // submissions.current?.clear()
            // setBoard(event.start.game.board)
        }
        if(event.timelimit) {
            setShowTimer(true)
            setTimeLimit({rem:event.timelimit.rem_time, onFinish:()=>{
                setTimeout(()=>{setShowTimer(false);setTimeLimit(null)}, 1000)
            }})
        }
        if(event.submit){
            console.log("event:submit")
            const sub = event.submit.sub
            if(sub.user.id === user?.id){
                if(sub.opt){
                    console.log("optimal")
                    setMsgs(msgs=>msgs.concat([OptimalMsg]))
                }
                setSending(false)
            }

            setSubs(subs => {
                console.log(subs)
                var nsubs = subs.slice()
                nsubs.push(sub)
                return nsubs //.sort(compSub).slice(0, Math.min(nsubs.length, 5))
            })
        }
    }

    const handleSubmit = () => {
        if(!inputState.reached) return;
        if(user === null){
            alert("提出するにはLOGIN済みである必要があります")
            return;
        }
        const hands = inputState.hands
        if(!ws.current)return; 
        setSending(true)
        var ev:SubmitCEvent = {game_id: game_id, hands:hands}
        ws.current.send(JSON.stringify({submit:ev}))
        console.log("submit:" + JSON.stringify({submit:ev}))
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
            setSending(false)
            
            if(ws.current !== null){
                ws.current.close();
            }
        };
    }, [user]);
    
    useEffect( () => {
        if(bBox.current)
            setRectSize([bBox.current.offsetHeight,bBox.current!.offsetWidth])
    }, [bBox.current]);
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
    const cellSize = game ? Math.min(rectSize[0] / game.problem.board.height, rectSize[1] / game.problem.board.width):0
    return (
        <div>
        <ArenaBox ref={bBox}>
        <CSSTransition timeout={500} in={!showResult} unmountOnExit={true}>
            <SlideIn>
        <CenterBox>
        <div style={{marginLeft:"1rem",width:`15rem`, minWidth:"fit-content", display:"flex", flexDirection:"column"}}>
            <div style={{flexShrink:0}}>
            <SubRanking subs = {subs}/>
            </div>
            <div style={{marginTop:"1ex", flexGrow:1}}>
            <SubTimeLine subs={subs}/>
            </div>
        </div>
        <div style={{width:`${sq}px`, position:"relative", flexShrink:0, marginLeft:"1rem", marginRight:"1rem"}}>
            {game &&
                <Board board={game.problem.board} cellSize={cellSize} robots={inputState.robots} mainRobot={game.problem.board.main_robot}/> 
                // <BoardPlayer onPlayEnd={()=>{setPlaySub(null)}} hands={playSub.hands} board={game.problem.board} cellSize={cellSize} robots={makeRobots(game.problem.board.poss)} mainRobot={game.problem.board.main_robot}/>
            }
        </div>
        <div style={{marginRight:"1rem",width:"15rem" ,display:"flex", flexDirection:"column"}}>
            <div style={{minHeight:"50%", flexGrow:1}}>
            <HandsInput disabled={!inputState.reached} onSubmit={handleSubmit} addHand={(hand)=>{inputDispatch({type:"add",hand:hand})}} rmHand={()=>{inputDispatch({type:"del"})}} clearHands={()=>{inputDispatch({type:"clear"})}} hands={inputState.hands} sending={sending}/>
            </div>
            {/* <FadeinBox show={showTimer} style={{maxHeight:"50%"}}> */}
            <CSSTransition timeout={500} in={showTimer} unmountOnExit={true}>
            <ExpandIn>
                <CircleTimer inplay={showTimer} duration={timelimit?.rem} onFinish={timelimit?.onFinish}/>
            </ExpandIn>
            {/* </FadeinBox> */}
            </CSSTransition>
        </div>
        </CenterBox>

        </SlideIn>
        </CSSTransition>

        <CSSTransition timeout={500} in={showResult} unmountOnExit={true} onExited={()=>setResult(null)}>
            <SlideIn>
                {result !== null && 
                    <Result subs={result.subs} game={result.game} rectSize={rectSize} onCloseResult={()=>{setShowResult(false);setState(s=> s!="playing" ? "interval" : "playing")}}/>
                }
            </SlideIn>
        </CSSTransition>
        </ArenaBox>
            
        {msgs.map(msg => 
            <BigMsg timeout={msg.timeout} show={true} onShowEnd={()=>{msg.onTimeout(); setMsgs(ms=>ms.filter(m=>m!==msg))}} key={msg.msg}
                style={Object.assign({fontFamily:"'Bungee', cursive",position:"absolute", top:"50%", left:"50%", transform : "translate(-50%, -50%)"}, msg.style)}
                text={msg.msg}
            />
        )}

        <BigMsg timeout={WaitingMsg.timeout} show={!showResult && (state == "interval" || state == "loading")} onShowEnd={()=>{}} key={WaitingMsg.msg}
            style={Object.assign({fontFamily:"'Bungee', cursive",position:"absolute", top:"50%", left:"50%", transform : "translate(-50%, -50%)"}, WaitingMsg.style)}
            text={WaitingMsg.msg}
        />
        </div>
    );
}
