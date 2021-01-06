import { useState } from "react";
import { useRecoilState } from "recoil";
import { API_SERVER, fetchMeAPI } from "./util";
import {fetchMe, userState} from "./recoil_states"

interface Props {

}

export default function Login(props : Props) {
    const [name, setName] = useState("")
    const [pass, setPass] = useState("")
    const [user, setUser] = useRecoilState(userState)

    const loginreq = () => {
        fetch("http://"+API_SERVER + "/login", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({"username":name, "password":pass}) // 本文のデータ型は "Content-Type" ヘッダーと一致する必要があります
          })
            .then((res) => res.json() )
            .then((data) => {console.log(data); setUser(data)})
            .catch((err) => console.error(err));
    }

    return (
        <div>
            <input type="text" onChange={(e)=>setName(e.target.value)}/>
            <input type="text" onChange={(e)=>setPass(e.target.value)}/>
            <button onClick={loginreq}>submit</button>
            <button onClick={() => {
                fetch(API_SERVER+"/twitter/signin", {method:"GET", mode:"same-origin"})
                    .then((res) => res.json() )
                    .then((data) => {
                        console.log(data)
                        const w = window.open(data["url"],"twitter-login", 'width=300,height=300')
                        if(w){
                            w.focus()
                            var timer = setInterval(function() { 
                                if(w.closed) {
                                    clearInterval(timer);
                                    fetchMe(setUser)
                                }
                            }, 1000);
                        }
                    })
                    .catch((err) => console.error(err));
                    }}>signin</button>
        </div>
    )
}
