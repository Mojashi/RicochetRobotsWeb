import Board, {BoardModel} from "./board"
import {makeRobots, RobotModel} from "./robot"
import {useState, useEffect, useRef, useReducer, ComponentPropsWithRef} from "react"
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
import BoardPlayer from "./boardplayer"
import { SampleSubmission } from "../sample"
import { FitSvgIcon, SvgIconButton } from "../shared/useful"
import { ExitToApp } from "@material-ui/icons"

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

interface Props {
    subs: SubmissionModel[],
    game: Game,
    rectSize:[number,number],
    onCloseResult: ()=>void,
}

export default function Result(props: Props) {
    const {subs, game, rectSize, onCloseResult, ...rest} = props
    const [playing, setPlaying] = useState<SubmissionModel | null>(null)

    useEffect(()=>{
        setPlaying(subs.slice().sort(compSub)[0])
    }, [subs, game])

    const sq = Math.min(rectSize[0], rectSize[1])
    const cellSize = game ? Math.min(rectSize[0] / game.problem.board.height, rectSize[1] / game.problem.board.width):0

    return (
        <div {...rest}>
        {/* <Screen>aaa</Screen> */}
        <CenterBox>
        <div style={{width:`15rem`, minWidth:"fit-content", margin:"1vw"}}>
            <div>RESULT</div>
            <SubRanking subs = {subs} playable={true} onPlay={(id)=>{setPlaying(subs.find(s=>id===s.id) || null)}} playing={playing?.id}/>
        </div>
        <div style={{width:`${sq}px`, position:"relative", flexShrink:0, marginLeft:"1rem", marginRight:"1rem"}}>
            {game !== null && (playing === null ? 
                <Board board={game.problem.board} cellSize={cellSize} robots={makeRobots(game.problem.board.poss)} mainRobot={game.problem.board.main_robot}/> :
                <BoardPlayer onPlayEnd={()=>{setPlaying(null)}} hands={playing.hands} board={game.problem.board} cellSize={cellSize} robots={makeRobots(game.problem.board.poss)} mainRobot={game.problem.board.main_robot}/>
            )}
        </div>

        <div style={{marginRight:"1rem",width:"15rem" ,display:"flex", flexDirection:"column"}}>
            <FitSvgIcon component={ExitToApp} onClick={onCloseResult}/>
        </div>
        </CenterBox>
        </div>
    );
}

// export const SampleBoardPlayer = <BoardPlayer 
//     subs={[SampleSubmission(),SampleSubmission(),SampleSubmission(),SampleSubmission()]}
//     game={sampleGame}
//  />