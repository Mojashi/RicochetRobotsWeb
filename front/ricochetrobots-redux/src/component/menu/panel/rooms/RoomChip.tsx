import React from "react"
import ReactTooltip from "react-tooltip"
import styled from "styled-components"
import { PALETTE } from "../../../../app/palette"
import { Room } from "../../../../model/Room"
import { RoomAbstract } from "../../../../model/RoomInfo"
import { LockIcon } from "../../../accessory/LockIcon"
import { UserIcon } from "../../../accessory/UserIcon"
import { Chip } from "../component/Chip"

type Props = {
    room : RoomAbstract,
    color : string,
    fill : string,
    className? : string,
    onClickEnter: (roomID:number)=>void,
}
export function RoomChip({room, fill,color, onClickEnter, className} : Props){
    return (
        <Div className={className} onClick={()=>onClickEnter(room.id)}>
            <TitleDiv fill={fill} >
                <Title color={color}>{room.name}</Title>
                <StatusIcons>
                    {room.private&& <LockIconStyled open={!room.private}/>}
                    <OnGameIcon onGame={room.onGame} data-tip={room.onGame?"ゲーム中":"待機中"}/>
                </StatusIcons>
                <ReactTooltip/>
            </TitleDiv>
            <Div2>
                <UserIcons>
                    {Object.entries(room.participants).slice(0,4).map(([_,user]) =>
                        <UserIconStyled key={user.id} userID={user.id}/>
                    )}
                </UserIcons>
                <Chips>
                    <Chip fill={PALETTE.orange} color={PALETTE.darkGray}>{`${room.gameConfig.goalPoint}点先取`}</Chip>
                </Chips>
            </Div2>
        </Div>
    )
}
const OnGameIcon = styled("div")<{onGame : boolean}>`
    border-radius:100%;
    height:1em;
    width:1em;
    ${p =>p.onGame? 
        `background:#ff9800;
        filter:drop-shadow(0 0 5px #ff9800);`:
        `background:#00ff45;
        filter:drop-shadow(0 0 5px #00ff45);`}
`
const StatusIcons = styled("div")`
    margin-left:auto;
    background-color:${PALETTE.paleBlue};
    height:1.6em;
    display:flex;
    align-items:center;
    padding-right:0.3em;
    padding-left:0.3em;
`
const Title = styled("div")<{color : string}>`
    font-size:1em;
    white-space:nowrap;
    height:1em;
    width:0;
    overflow:visible;
    font-weight:bold;
`
const LockIconStyled = styled(LockIcon)`
    height:100%;
`
const TitleDiv =styled("div")<{fill : string}> `
    background-color:${p=>p.fill};
    color : ${p=>p.color};
    border-bottom: 2px solid;
    height:1.6em;
    display:flex;
    padding: 0.3em 0 0.3em 0.3em;
`

const Div = styled("div")`
    cursor:pointer;
    width:min-content;
    border-radius:0.8em;
    overflow:hidden;
    background-color:white;
    margin:0.7em;
    box-shadow:0 4px 4px rgba(0, 0, 0, 0.25);
`
const UserIconStyled = styled(UserIcon)`
    height:50%;
    width:50%;
    border:solid 1px black;
    box-sizing:border-box;
`

const Div2 = styled("div")`
display:flex;
flex-direction:row;
align-items:center;
padding:0.5em;
`

const UserIcons = styled("div")`
    width:4em;
    height:4em;
    display:flex;
    flex-wrap:wrap;
`
const Chips = styled("div")`
    display:flex;
    flex-direction:column;
    width:fit-content;
    padding-left:0.5em;
`