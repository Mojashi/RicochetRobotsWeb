import React from "react"
import styled from "styled-components"
import { PALETTE } from "../../../../app/palette"
import { Room } from "../../../../model/Room"
import { Chip } from "../component/Chip"

type Props = {
    room : Room,
    color : string,
    fill : string,
    className? : string,
}
export function RoomChip({room, fill,color, className} : Props){
    return (
        <Div className={className}>
            <Title fill={fill} color={color}>{room.name}</Title>
            <Div2>
                <UserIcons>
                    <Icon/>
                    <Icon/>
                    <Icon/>
                    <Icon/>
                </UserIcons>
                <Chips>
                    <Chip fill={PALETTE.orange} color={PALETTE.darkGray}>{"あいう"}</Chip>
                    <Chip fill={PALETTE.orange} color={PALETTE.darkGray}>{"あいう"}</Chip>
                    <Chip fill={PALETTE.orange} color={PALETTE.darkGray}>{"あいう"}</Chip>
                </Chips>
            </Div2>
        </Div>
    )
}

const Div = styled("div")`
    border-radius:0.8em;
    overflow:hidden;
    background-color:white;
    margin:0.7em;
    box-shadow:0 4px 4px rgba(0, 0, 0, 0.25);
`
const Title = styled("div")<{fill : string, color : string}>`
    font-size:1.2em;
    font-weight:bold;
    background-color:${p=>p.fill};
    color : ${p=>p.color};
    border-bottom: 2px solid;
    padding:0.3em;
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
const Icon = styled("div")`
    width:2em;
    height:2em;
    background-color:blue;
    
`
const Chips = styled("div")`
    display:flex;
    flex-direction:column;
    width:fit-content;
    padding-left:0.5em;
`