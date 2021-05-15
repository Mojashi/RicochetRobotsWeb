import AnonIcon from "../../img/anonymous.png"
import React, { useState } from "react"
import { AnonymousUser, User, UserID } from "../../model/User"

export const UserIcon = ({className,userID}:{className?:string, userID?:UserID})=> {
    const [src,setSrc] = useState((!userID || (userID === AnonymousUser.id)) ? AnonIcon : `${process.env.PUBLIC_URL}/userPics/${userID}.jpg`)
    return <img className={className} onError={()=>setSrc(AnonIcon)}
        src={src}
        alt="icon"/>
}