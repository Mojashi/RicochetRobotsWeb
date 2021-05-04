import React from "react"
import { useSelector } from "react-redux"
import { ShortestView } from "../component/room/pane/Shortest"
import { UserNavView } from "../component/usernav/UserNav"
import { shortestSelector } from "./GameSlice"
import { loggedInSelector, userSelector } from "./SiteSlice"
import Icon from "../img/usericon.jpg"
import AnonIcon from "../img/anonymous.png"

type Props = {
    className? : string,
}

export function UserNav({className} : Props){
    const user = useSelector(userSelector)
    const loggedIn = useSelector(loggedInSelector)

    return <UserNavView img={loggedIn ? Icon : AnonIcon} className={className}/>
}