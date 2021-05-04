import React from "react"
import styled from "styled-components"
import { RedRobotColor, SolidRobotIcon } from "../../accessory/solidRobots/SolidRobotIcon"

type Props = {
    title : string|React.ReactNode,
    color : string,
    children : React.ReactNode,
    className? : string,
}

export function Panel({title, color, children, className} : Props) {
    return (
        <Div color={color} className={className}>
            <Title>
                <RobotIconStyled color={RedRobotColor} autoRotate={false} dragRotate={true}
                 zoom={2} rotate={{x:-Math.PI/3, y:Math.PI/5, z:Math.PI/8}}/>
                {title}
            </Title>
            <Content>
                {children}
            </Content>
        </Div>
    )
}

const RobotIconStyled = styled(SolidRobotIcon)`
    height:5rem;
    width:5rem;
    overflow:visible;
`

const Div = styled("div")<{color : string}>`
    background-color: ${p=>p.color};
    border-radius: 0 15vh 15vh 0;
    height: 100% !important;
    color:white;
    box-sizing:border-box;
    display:flex;
    flex-direction:column;
`

const Title = styled("div")`
    font-size: 2rem;
    height:5rem;
    display:flex;
    margin-left:1.5rem;
    align-items:center;
    font-weight:bold;
    text-align:left;
    white-space:nowrap;
    flex-shrink:0;
    flex-grow:0;
`

const Content = styled("div")`
    flex-grow:1;
    flex-shrink:1;
    justify-content: center;
    padding: 0 5% 5% 5%;
    box-sizing:border-box;
    height:calc(100% - 5rem);
`