import AnonIcon from "../../img/anonymous.png"
import React, { useEffect, useState } from "react"
import { AnonymousUser,  UserID } from "../../model/User"

export function UserIcon({className,userID}:{className?:string, userID?:UserID}) {
	const [src,setSrc] = useState(
		(userID === undefined || (userID === AnonymousUser.id)) ? 
			AnonIcon : `${process.env.PUBLIC_URL}/userPics/${userID}.jpg`
	)
	useEffect(()=>{
		setSrc(
			(userID === undefined || (userID === AnonymousUser.id)) ? 
				AnonIcon : `${process.env.PUBLIC_URL}/userPics/${userID}.jpg`)
	}, [userID])
	return <img className={className} onError={()=>{setSrc(AnonIcon)}}
		src={src}
		alt="icon"/>
}