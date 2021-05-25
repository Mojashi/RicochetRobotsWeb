import React, {  useEffect, useRef } from "react"
import { Pos } from "../../../model/game/Pos"

export type AnimPath = Pos[][]

type Props = {
	cellSize :number
	paths : AnimPath
	onAnimEnd? : ()=>void
} & React.SVGAttributes<SVGImageElement>

export function ConvAnimPathToPath(paths : AnimPath, unit : number):string{
	return paths.map(path=>
		`M ${path[0].x*unit} ${path[0].y*unit}\n` + 
			path.map(p=>
				`L ${p.x*unit} ${p.y*unit}`
			).join("\n")
	).join("\n")
}

export function SvgAnim({paths,cellSize, onAnimEnd, ...rest} : Props){
	const ref = useRef(null)
	useEffect(()=>{
		if(ref.current){
			//@ts-ignore
			ref.current.beginElement()
			//@ts-ignore
		}
	}, [paths])
	useEffect(()=>{
		if(ref.current){
			//@ts-ignore
			ref.current.onend = onAnimEnd
		}
	},[onAnimEnd])
	return <animateMotion ref={ref} {...rest}
		fill={"freeze"}
		dur={`${paths.length*0.1}s`} repeatCount="1"
		path={ConvAnimPathToPath(paths,cellSize)}
		onEnded={onAnimEnd}
	/>
}