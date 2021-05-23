import React, { SVGProps } from "react"
import styled from "styled-components"
import { Cell, Mirror } from "../../../model/game/board/Cell"
import WallImg from "../../../img/wall.svg"
import MirrorImg1 from "../../../img/mirror1.svg"
import MirrorImg2 from "../../../img/mirror2.svg"
import MirrorImg3 from "../../../img/mirror3.svg"
import MirrorImg4 from "../../../img/mirror4.svg"
import MirrorImg5 from "../../../img/mirror5.svg"
import GoalImg from "../../../img/goal.svg"

const MirrorImgs = [MirrorImg1,MirrorImg2,MirrorImg3,MirrorImg4,MirrorImg5]

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
            {cell.mirror&& 
                <MirrorElm x={x} y={y} mirror={cell.mirror}/>
            }
        </g>
    )
}

const Wall = styled.image.attrs({
    href:WallImg,
    width:10.5,
    height:10.5,
})``

const Goal = styled.image.attrs({
    href:GoalImg,
    width:10,
    height:10,
})``

const MirrorElm = ({mirror,x,y}:{mirror: Mirror, x : number, y : number})=>
    <image href={MirrorImgs[mirror.trans]} width={10} height={10} x={x} y={y} 
        transform={`rotate(${mirror.side*90},${x+5},${y+5})`}/>
