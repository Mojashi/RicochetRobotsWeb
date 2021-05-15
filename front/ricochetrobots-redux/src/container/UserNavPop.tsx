import React, { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ShortestView } from "../component/room/pane/Shortest"
import { UserNavView } from "../component/usernav/UserNav"
import { loggedInSelector, shortestSelector, setUser } from "./GameSlice"
import Icon from "../img/usericon.jpg"
import AnonIcon from "../img/anonymous.png"
import { UserNavPopView } from "../component/usernav/UserNavPop"
import { API_SERVER } from "../api/api"
import { getMeApi } from "../api/getMe"
import { logoutApi } from "../api/logout"
import { AnonymousUser } from "../model/User"

type Props = {
    className? : string,
}

export function UserNavPop({className} : Props){
    const loggedIn = useSelector(loggedInSelector)
    const dispatch = useDispatch()

    const onClickLogin = useCallback(() => {
        fetch(API_SERVER + `/twitter/signin`, {method:"GET", mode:"same-origin"})
            .then((res) => res.json() )
            .then((data) => {
                console.log(data)
                const w = window.open(data["url"],"twitter-login", 'width=300,height=300')
                if(w){
                    w.focus()
                    var timer = setInterval(function() { 
                        if(w.closed) {
                            clearInterval(timer);
                            getMeApi((user)=>{dispatch(setUser(user))})
                        }
                    }, 1000);
                }
            })
            .catch((err) => console.error(err));
    }, [dispatch])
    const onClickLogout = () => {
        logoutApi(()=>dispatch(setUser(AnonymousUser)))
    }

    return <UserNavPopView loggedIn={loggedIn} onClickLogIn={onClickLogin} onClickLogOut={onClickLogout} className={className}/>
}