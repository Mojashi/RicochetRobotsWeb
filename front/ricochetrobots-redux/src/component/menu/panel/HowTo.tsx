import React from "react"
import styled from "styled-components"
import { PALETTE } from "../../../app/palette"
import { Panel } from "./Panel"

import ScrollArea from "react-scrollbar"


export function HowToPanel({className} : {className? : string}){
	
	//だれか書いてくれ〜〜〜〜〜
	return (
		<Panel title="あそびかた" color={PALETTE.paleRed} className={className}>
			<Div>
				<ScrollArea style={{height:"100%", width:"fit-content"}} contentStyle={{minHeight:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}
					vertical={true} horizontal={true}>
					<Text>
						<h2>ルール</h2>
					盤面上に複数体ロボットがいます<br/>
					ロボットは、一度動き出すと壁、もしくは他のロボットにぶつかるまで止まりません<br/>
					これらを動かして赤い旗の位置に主役のロボット（中央に表示）を止めるが目的です<br/>
						<h2>操作方法</h2>
					数字キーを押し続けながら、矢印キーを押すと該当するロボットがその方向に動きます。<br/>
					R：リセット<br/>
					BackSpace：１手もどす<br/>
					Enter: 提出<br/>
					</Text>
				</ScrollArea>
			</Div>
		</Panel>
	)
}

const Div = styled("div")`
	display:flex;
	flex-direction:column;
	align-items:center;
	justify-content:space-around;
	height:100%;   
`
const Text = styled("div")`
	font-weight:bold;
	width:fit-content;
`