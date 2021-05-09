import React from "react"
import styled from "styled-components"
import { PALETTE } from "../../../../app/palette"
import { Room } from "../../../../model/Room"
import { Panel } from "../Panel"
import { RoomChip } from "./RoomChip"
import {SearchBox} from "../component/SearchBox"
import Button from "../Button"
import { useToggle } from "../../../../app/utils"
import ScrollArea from "react-scrollbar"

type Props ={
    rooms : Room[],
    className? : string,
}

export function RoomsPanel({className, rooms} : Props){
    const [showProg, toggleShowProg, ] = useToggle(false);
    const [showWait, toggleShowWait, ] = useToggle(false);

    return (
        <Panel title="だれかと" color={PALETTE.darkBlue} className={className}>
            <InnerDiv>
                <ScrollArea horizontal={false} vertical={true}>
                <Header>
                    <SearchBox placeHolder="🔎ルーム名" defaultValue=""/>
                    <Button color={PALETTE.paleBlue} fill={PALETTE.white} text="進行中を表示" onClick={toggleShowProg} selected={showProg}/>
                    <Button color={PALETTE.paleBlue} fill={PALETTE.white} text="待機中を表示" onClick={toggleShowWait} selected={showWait}/>
                </Header>
                    <Div>
                        {rooms.map(room => <RoomChip key={room.id} room={room} fill={PALETTE.paleBlue} color={PALETTE.white}/>)}
                    </Div>
                </ScrollArea>
            </InnerDiv>
        </Panel>
    )
}

RoomsPanel.defaultProps = {
    rooms:[],
}

const Div = styled("div")`
    display:flex;
    flex-wrap:wrap;
    justify-content:flex-start;
    align-items:flex-start;
    height:100%;   
    width:100%;
`
const InnerDiv = styled("div")`
    display:flex;
    flex-direction:column;
    height:100%;
`

const Header = styled("div")`
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center; 
`