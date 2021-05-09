import React from "react"
import styled from "styled-components"
import { UserIcon } from "../../../../model/UserIcon"
import { LeaderBoardUser } from "../LeaderBoard"
import { Card } from "./Card"
import ScrollArea from "react-scrollbar"
import { PALETTE } from "../../../../app/palette"

type Props = {
    className? : string,
    user : LeaderBoardUser,
    rank : number,
}

export function LeaderBoardUserCard({rank, user, className} : Props) {
    return (
        <CardStyled index={rank} className={(className?className:"") + (user.online ? " online" : " offline")}>
            <Div>
            <PointDiv>{user.point}pt</PointDiv>
            <UserDiv>
                <ScrollArea horizontal={true} vertical={true} 
                    contentStyle={{width:"max-content"}}
                    horizontalContainerStyle={{height:"5px"}}
                >
                    <UserContentDiv>
                        <UserIconStyled/>
                        <UserNameDiv>{user.user.name}</UserNameDiv>
                    </UserContentDiv>
                </ScrollArea>
            </UserDiv>
            </Div>
        </CardStyled>
    )
}
const UserContentDiv = styled("div")`
    width:max-content;
    display:flex;
    align-items:center;
`
const UserNameDiv = styled("div")`
`
const Div = styled("div")`
    display:flex;
    justify-content: space-evenly;
`
const CardStyled = styled(Card)`
    margin-top:0.5em;

    &.online {
        border: solid 2px ${PALETTE.paleGreen};
    }
    &.offline {
        border: solid 2px ${PALETTE.orange};
    }
`

const PointDiv = styled("div")`
    width:fit-content;
    margin-left:0.9em;
    margin-right:0.9em;
    display:flex;
    justify-content:center;
    font-size:1.2em;
    font-weight:bold;
    margin-right:0.1em;
`
const UserDiv = styled("div")`
    font-size:0.9em;
    max-width:10em;
    text-align:center;
    font-weight:bold;
`

const UserIconStyled = styled(UserIcon)`
    height:2em; 
`