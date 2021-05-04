import { Problem } from "./problem"
import Board, {BoardModel} from "./board"
import {makeRobots, RobotModel} from "./robot"
import {useState, useEffect, useRef, useReducer, useImperativeHandle, RefObject, forwardRef} from "react"
import styled from "styled-components"
import {API_SERVER, compSub, eqPos, go, Pos, simulate} from "../util"
import {ServerEvent} from "./server_events"
import {ClientEvent, SubmitCEvent} from "./client_events"
import HandsInput from "../shared/hands_input"
import { Hand } from "./hand"
import SubRanking from "../shared/subrank"
import {SubmissionModel} from "../shared/submission"
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
import { InputReducer } from "./inputReducer"
import {TimeUpMsg as TimeUpMsgMaker, OptimalMsg, WaitingMsg, Message} from "./message"
import {GameHandler, gameHandler} from "./gameHandler"

export type Rule = string

const WankoSoba  :Rule = "wanko"
const DontBeLate :Rule = "dblate"

export interface Game {
	id          :number
	rule        :Rule
	problem     :Problem
	subs :SubmissionModel[]
}

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

interface Props {
    game : Game|null
}


export const GameView = forwardRef<GameHandler, Props>(({game}, ref) => {
    const [subs , setSubs] = useState<SubmissionModel[]>([]) 
    const [rectSize, setRectSize] = useState<[number, number]>( [0,0] )
    const user = useRecoilValue(userState)
    var bBox = useRef<HTMLDivElement>(null)
    const [sending,setSending] = useState<boolean>(false)

    const [showTimer, setShowTimer] = useState<boolean>(false)
    const [timelimit, setTimeLimit] = useState<{rem:number, onFinish:()=>void} | null>(null)
    
    const [showResult, setShowResult] = useState<boolean>(false)
    const [result, setResult] = useState<{subs:SubmissionModel[], game:Game}|null>(null)

    const [msgs, setMsgs] = useState<Message[]>([])

    const [inputState, inputDispatch] = useReducer(InputReducer(game), {robots:[], his:[], hands:[], reached:false})

    const TimeUpMsg = TimeUpMsgMaker(setSubs)

    useImperativeHandle(ref, gameHandler(
        setShowTimer,
        setTimeLimit,
        setShowResult,
        setSubs,
        setSending,
        setMsgs,
        user))

    const procServerEvent = (event:ServerEvent) => {
        if(event.timelimit) {
        }
        if(event.submit){
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
})
