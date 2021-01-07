import React, { useRef } from "react"
import { Dir, UP, RT, DN, LT, Hand } from "../game/hand"
import { useEffect, useState } from "react"
import { robotColor, robotImg, useKeyPress } from "../util"
import styled, {css, keyframes} from "styled-components"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward"
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import SvgIcon from "@material-ui/icons/ArrowBack"
import RefreshIcon from '@material-ui/icons/Refresh';
import SendIcon from '@material-ui/icons/Send';
import SimpleBar from "simplebar-react"
import 'simplebar/dist/simplebar.min.css';
import { CircularProgress } from "@material-ui/core"

function parseHands(str: string): Hand[] {
    var ret: Hand[] = []
    if (ret.length % 2 !== 0) throw new Error("invalid format")

    for (var i = 0; i < str.length; i += 2) {
        var robot: number
        var dir: Dir

        robot = parseInt(str[i])
        switch (str[i + 1]) {
            case "u": dir = UP; break;
            case "r": dir = RT; break;
            case "d": dir = DN; break;
            case "l": dir = LT; break;
            default: throw new Error("invalid direction")
        }
        ret.push({ robot: robot, dir: dir })
    }

    return ret
}

const DirText = styled("div")`
    color:white;
    font-weight:bold;
    font-size:xx-large;
`

const slide = keyframes`
    0%{
        transform:translateY(-100%);
    }
    100%{
        transform:translateY(0);
    }
`  

const HandBoxi = styled("div")`
    display:flex;
    flex-wrap:nowrap;
    text-align:center; 

    box-sizing:border-box;
    /* width:100%; */
    font-weight: bold;
    border-radius:7px;
    background-color: floralwhite; 
    color: black;
    text-shadow: 0 0 1px black;
    box-shadow: 1px 1px 4px #8c6d55;
    margin:2px 2px 2px 2px;
    text-decoration: none;
    overflow:hidden;
    z-index:-1;
    /* animation:${slide} 1s ease-in-out;
    transition:all 0.5s;  */
`


const ResBox = styled('div')`
    box-sizing:border-box;
    width:100%;
    /* padding: 12px 12px 12px 5px; */
    /* margin: 12px 12px 12px 0px; */
    font-weight: bold;
    /* border: inset 4px #a4c7cc;*/
    border-radius:7px;
    background-color: "floralwhite"; 
    color: black;
    text-shadow: 0 0 1px black;
    box-shadow: 1px 1px 4px #8c6d55;
    -webkit-text-decoration: none;
    text-decoration: none;
    /* display:grid;
    grid-template-rows: 60% 40%;
    grid-template-columns: 20% 40% 40%; */
    overflow:hidden;
`

function toArrow(dir: Dir) {
    switch (dir) {
        case UP:
            return ArrowUpwardIcon
        case RT:
            return ArrowForwardIcon
        case DN:
            return ArrowDownwardIcon
        case LT:
            return ArrowBackIcon
        default:
            return ArrowUpwardIcon
    }
}

function HandBox(props: { hand: Hand , r: number}) {
    const { hand, r } = props;

    return (
        <HandBoxi>
            {r}
            <img style={{ objectFit: "cover", margin: "0.5em", width: "5em", height: "5em", alignSelf: "center" }} src={robotImg(robotColor(hand.robot))} />
            <div style={{ fontSize: "4em", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <SvgIcon component={toArrow(hand.dir)} fontSize="inherit" style={{ alignSelf: "center" }} />
            </div>
        </HandBoxi>
    )
}

const ScrollBox = styled(SimpleBar)`
    /* border: solid saddlebrown; */
    height:100%;
    /* border-radius: 10px; */
        position:relative;
        box-shadow: 0px 0px 10px 0px saddlebrown inset;
    /* &::before{
        position:relative;
        height:100%;
        width:100%;
        background-color: rgba(0,0,0,0.05);
        box-shadow: 0px 0px 10px 0px saddlebrown inset;
        content:"aaa";
        z-index:100;
    } */
`

const InnerBox = styled("div")`
    background-color: rgba(0,0,0,0.05);
    position:relative;
    min-height:100vh;
    padding:0.5em 0.5em 1em 0.5em;
/* box-shadow: 0px 0px 10px 0px saddlebrown inset; */
    /* border-radius: 10px; */
    justify-content:flex-end;
    display:flex; 
    flex-direction:column-reverse; 
    z-index:-2;
`

function HandsBox(props: { hands: Hand[] }) {
    const { hands } = props;
    const ref = useRef<HTMLDivElement>(null)
    useEffect(()=>{
        if(ref.current === null) return;
        ref.current.scrollTop = 0
    }, [hands])

    return (
        <ScrollBox autoHide={true} scrollableNodeProps={{ ref: ref }}>
            <InnerBox>
            {hands.map((hand, idx) => <HandBox hand={hand} key={"hand" + idx.toString()} r={hands.length - idx}/>)}
            </InnerBox>
        </ScrollBox>
    )
}

const HandsInputRoot = styled("div")`
    display:grid;
    width:15vw; 
    height:100%;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 5em 1fr;
`

const WoodButton = styled("button")`
    /* background-color:rgba(0,0,0,0.15); */
    /* margin-left:0.5em; */
    border: outset 5px #8040129e;
    border-radius: 7px;
    margin-top:2.5px;
    margin-bottom:2.5px;
    width:100%;
    height:calc(100% - 5px);
    box-sizing:border-box;

    justify-content: center;
    font-weight: bolder;
    text-align: center;
    align-items:center;
    flex-direction: column;
    display: flex;
    font-size: xxx-large;
    color: saddlebrown;

    background-color:rgba(255,255,255,0.2);
    
    &:hover {
        background-color:rgba(0,0,0,0);
        border: inset 5px #8040129e;
        cursor:pointer;
    }
    &:disabled{
        background-color:rgba(255,255,255,0.2);
        border: outset 5px #8040129e;
        opacity: 0.5;
        cursor: default;
    }
`

interface Props {
    addHand: (hands: Hand) => void
    rmHand: () => void
    clearHands: () => void
    onSubmit: () => void
    disabled: boolean
    sending: boolean
    hands: Hand[]
}

export default function HandsInput(props: Props) {
    const {hands, addHand, rmHand, clearHands, onSubmit, disabled, sending} = props

    const robotPressed = useKeyPress(["1", "2", "3", "4", "0"])
    const arrowPressed = useKeyPress(["ArrowUp", "ArrowRight", "ArrowLeft", "ArrowDown"])
    const [sRobot, setsRobot] = useState<number | null>(null)

    useEffect(() => {
        var bef = Date.now()
        const bsHandler = ({ key }: { key: string }) => {
            if (key == "Backspace") {
                var time = Date.now()
                
                if(bef + 100 < time){
                    rmHand()
                    bef = time
                }
            }
            if(key == "Enter") {
                onSubmit()
            }
            if(key == "r"){
                clearHands()
            }
        }
        window.addEventListener('keydown', bsHandler);
        return () => {
            window.removeEventListener('keydown', bsHandler);
        };
    }, [hands]);

    useEffect(() => {
        if (robotPressed.has("0")) setsRobot(0)
        else if (robotPressed.has("1")) setsRobot(1)
        else if (robotPressed.has("2")) setsRobot(2)
        else if (robotPressed.has("3")) setsRobot(3)
        else if (robotPressed.has("4")) setsRobot(4)
        else setsRobot(null)
    }, [robotPressed])

    const pressArrow = (dir: Dir) => {
        if (sRobot == null) return;
        try {
            addHand({ robot: sRobot, dir: dir })
        } catch (e: any) {

        }
    }

    useEffect(() => {
        if (arrowPressed.has("ArrowUp")) pressArrow(UP)
        else if (arrowPressed.has("ArrowRight")) pressArrow(RT)
        else if (arrowPressed.has("ArrowDown")) pressArrow(DN)
        else if (arrowPressed.has("ArrowLeft")) pressArrow(LT)
    }, [arrowPressed])

    const handleSubmit = () => {
        onSubmit()
        // setHands([])
    }

    return (
        <HandsInputRoot>
            {/* <div > */}
            <div style={{ gridColumnStart: "1", gridColumnEnd: "2", width:"100%", height:"100%" }} >
                <WoodButton disabled={!disabled} onClick={handleSubmit} id="SendButton">
                    {sending ?  <CircularProgress color="inherit"/> : <SendIcon fontSize="inherit"/>}
                </WoodButton>
            </div>
            <div style={{ gridColumnStart: "2", gridColumnEnd: "3" }} >
                {/* <HandBoxi>
                    {sRobot !== null && <img style={{ objectFit: "cover", margin: "0.5em" }} src={robotImg(robotColor(sRobot))} />}
                </HandBoxi> */}
                <WoodButton onClick={clearHands}>
                    <RefreshIcon fontSize="inherit"/>
                </WoodButton>
            </div>
            
            <div style={{ gridColumn: "1/3", gridRow:"2/4"}}>
                <HandsBox hands={hands} />
            </div>
        </HandsInputRoot>
    )
}

