import React, { SVGProps } from "react"
import styled from "styled-components"
import { Cell } from "../../../model/game/board/Cell"
import WallImg from "../../../img/wall.svg"
import GoalImg from "../../../img/goal.svg"

type Props = {
    cell : Cell,
    x : number,
    y : number,
} & Omit<Omit<Omit<Omit<React.SVGProps<SVGImageElement>, "width">, "height">, "href">, "ref">

export function CellView({cell, x, y, ...rest} : Props){
    return (
        <g>
            {cell.goal && <Goal {...rest} x={x} y={y}/>}
            {cell.walls.map((w,idx) => w && 
                <Wall key={idx} transform={`rotate(${idx * 90}, ${x + 5}, ${y + 5})`} 
                    x={x-0.25} y={y-0.25} {...rest}/>
            )}
        </g>
    )
}

const Wall = styled.image.attrs({
    href:WallImg,
    width:10.5,
    height:10.5,
})``

const Goal = styled("image").attrs({
    href:GoalImg,
    width:10,
    height:10,
})``