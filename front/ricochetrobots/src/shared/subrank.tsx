import { Hand } from "../game/hand"
import User from "./user"
import styled from "styled-components"


export interface SubmissionModel {
    id:number
    hands : Hand[]
    user : User
    date : Date
}

function compSub(a:SubmissionModel,b:SubmissionModel):number{
    if(a.hands.length === b.hands.length){
        return a.date > b.date ? 1 : -1
    }
    return a.hands.length > b.hands.length ? 1 : -1
}

const ResBox = styled('div')<{rank:number}>`
    padding: 12px;
    margin: 12px 12px 12px 0px;
    font-weight: bold;
    border: inset 4px #434fa9;
    background-color: #9eaab6;
    border-left: solid 5px #778899;
    -webkit-text-decoration: none;
    text-decoration: none;
    color: #fff;
    display:grid;
    grid-template-rows: 60fr 40fr;
    grid-template-columns: 20fr 40fr 40fr;
    position:absolute;
    left:0px;
    top:0px;
    transform: translateY(${p=>p.rank}%);
    transition:transform 0.5s
`

const MainBox = styled.div`
    text-align:center;
    font-size:larger;
    grid-column:2;
    grid-row:1;
`
const NameText = styled.div`
    text-align:right;
    font-size:small;
    grid-column:3;
    grid-row:2;
`

const RankBox = styled.div`
    grid-column:1;
    grid-row-start:1;
    grid-row-end:3;
    display:flex;
    align-items:center;
    flex-direction:vertical;
    font-size:x-large;
    padding:5px;
    color:#fbe58f;
`

function Submission(props : {rank:number, sub : SubmissionModel}) {
    const {rank, sub} = props

    return (
        <ResBox rank={rank *  110}>
            <RankBox><div>{`${rank+1}th`}</div></RankBox>
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
    color:white;
    font-weight: bold;
    font-size: x-large;
    position:relative;
`

const SubmissoinsBox = styled("div")`
    position:relative;
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