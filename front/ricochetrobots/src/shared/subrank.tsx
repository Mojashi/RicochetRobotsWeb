import { Hand } from "../game/hand"
import User from "./user"
import styled, { keyframes } from "styled-components"


export interface SubmissionModel {
    id:number
    hands : Hand[]
    user : User
    date : Date
    opt : Boolean
}

function compSub(a:SubmissionModel,b:SubmissionModel):number{
    if(a.hands.length === b.hands.length){
        return a.date > b.date ? 1 : -1
    }
    return a.hands.length > b.hands.length ? 1 : -1
}

const shine = keyframes`
  0% {
    transform: scale(0) rotate(45deg);
    opacity: 0;
  }
  80%{ 
    transform: scale(0) rotate(45deg);
    opacity: 0.5;
  }
  81%{ 
    transform: scale(4) rotate(45deg);
    opacity: 1;
  }
  100%{ 
    transform: scale(50) rotate(45deg);
    opacity: 0;
  }
`

const ResBox = styled('div')<{rank:number, opt?:Boolean}>`
    box-sizing:border-box;
    width:100%;
    padding: 12px 12px 12px 5px;
    margin: 12px 12px 12px 0px;
    font-weight: bold;
    /* border: inset 4px #a4c7cc;*/
    border-radius:7px;
    background-color: ${p=>p.opt?"gold":"floralwhite"}; 
    color: black;
    text-shadow: 0 0 1px black;
    box-shadow: 1px 1px 4px #8c6d55;
    -webkit-text-decoration: none;
    text-decoration: none;
    display:grid;
    grid-template-rows: 60% 40%;
    grid-template-columns: 20% 40% 40%;
    position:absolute;
    left:0px;
    top:0px;
    transform: translateY(${p=>p.rank}%);
    transition:transform 0.5s; 
    overflow:hidden;
    
    &::before{ 
        content: '';
        width: 1em;
        height: 100%;
        background-color: #fff;
        animation: ${p=>p.opt ? shine : ""}  3s ease-in-out infinite;
        position: absolute;
        left: 0;
        top:-180;
        opacity: 0;
        transform: rotate(45deg);
    }
`
ResBox.defaultProps = {
    opt:false,
}

const MainBox = styled.div`
    text-align:center;
    font-size:larger;
    grid-column:2;
    grid-row:1;
`
const NameText = styled.div`
    text-align:right;
    font-size:small;
    grid-column:2/4;
    grid-row:2;
`

const RankBox = styled.div`
    grid-column:1;
    grid-row-start:1;
    grid-row-end:3;
    display:flex;
    align-items:center;
    flex-direction:vertical;
    font-size:larger;
    /* color:#434fa9; */
    width:100%;
`

function getRankStr(rank : number) : string {
    const rs = rank.toString()
    if(rs[rs.length-1] === "1") return rs+"st"
    if(rs[rs.length-1] === "2") return rs+"nd"
    if(rs[rs.length-1] === "3") return rs+"rd"
    return rs+"th"
}

function Submission(props : {rank:number, sub : SubmissionModel}) {
    const {rank, sub} = props

    return (
        <ResBox rank={rank *  110} opt={sub.opt}>
            <RankBox><div style={{marginLeft:"auto", marginRight:"auto"}}>{(rank + 1).toString()}</div></RankBox>
            <MainBox>{sub.hands.length.toString().padStart(2," ") +" moves"} </MainBox>
            <NameText>{`by ${sub.user.name}`}</NameText>
        </ResBox>
    )
}

const RankingBox = styled('div') `
    white-space: nowrap;
    width:100%;
`

const RankingTitle = styled('div') `
    color:saddlebrown;
    font-weight: bold;
    font-size: x-large;
    position:relative;
    text-align:center;
    border-radius: 4px;
    border: solid;
`

const SubmissoinsBox = styled("div")`
    position:relative;
    width:100%;
`

export default function SubRanking(props : {subs : SubmissionModel[]}){
    const {subs} = props

    return (
        <RankingBox>
        <RankingTitle>SUBMISSIONS</RankingTitle>
        <SubmissoinsBox>
        {subs.sort(compSub).map((sub, idx) =>
            <Submission key={sub.id} rank={idx} sub={sub}/>
        )}
        </SubmissoinsBox>
        </RankingBox>
    )
}