import React, { useEffect, useRef } from "react"
//@ts-ignore
import {Shape, Rect, Cone, Hemisphere, useRender } from 'react-zdog'

type Props ={
  color:string,
  shadow:string,
  speed : number,
  rotate?:{x:number,y:number,z:number},
  x:number,
  y:number,
}

export function SolidRobotIconRaw({color,shadow,speed,rotate, x,y}:Props){
  const ref = useRef<React.MutableRefObject<Shape>>()
  const rot = useRef<{x:number, y:number, z:number}>(
    rotate ? rotate : {x:Math.random()-0.5 - Math.PI/2,y:Math.random()-0.5,z:Math.random()*Math.PI*2}
  )
  const speedRef = useRef<number>(speed);

  useEffect(()=>{
    speedRef.current = speed;
    return ;
  }, [speed])

  useRender(() => {
    if(ref.current && ref){
      //@ts-ignore
      ref.current.rotate = rot.current
    }
    rot.current.z += speedRef.current;
  })

  return (
    //body
    <Shape rotate={{x:Math.PI, y:0, z:0}} translate={{x:x, y:y}} stroke={17} color={color} ref={ref}>
      <Rect width={6} height={6} stroke={2} rotate={{x:Math.PI/2}} translate={{y:-7}} color={shadow}/>
      <Hemisphere diameter={8} translate={{z:-8}} stroke={3} color={shadow}>
        <Cone translate={{z:-1}} rotate={{x:Math.PI}} diameter={8} stroke={3} length={7} color={color}>
          <Shape translate={{y:2.5, z:5}} path={[{x:-1.5}, {x:1.5}]} stroke={1} color={shadow}/>
          <Shape translate={{y:3.5, z:3}} path={[{x:-2}, {x:2}]} stroke={1} color={shadow}/>
        </Cone>
      </Hemisphere>
      <Cone diameter={14} rotate={{x:Math.PI}} translate={{z:8}} length={2} color={shadow}/>
    </Shape>
  )
}

SolidRobotIconRaw.defaultProps = {
  x:0,
  y:0,
}