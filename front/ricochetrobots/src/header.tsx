import react, { useState } from "react"
import { useRecoilState } from "recoil"
import styled from "styled-components"
import {fetchMe, userState} from "./recoil_states"
import { API_SERVER } from "./util"
import {useHistory} from "react-router-dom"
import { CircularProgress } from "@material-ui/core"
interface Props {

}

const HeaderBox = styled("div")`
    width:100%;
    height:100%;
    position:relative;
    background-color:rgba(255,255,255,0.48);
    box-shadow:0px 0px 5px black;
    color:saddlebrown;
    display:flex;
`

const HeaderContent = styled("div")`
    /* height:100%; */
    width:fit-content;
    font-size:x-large;
    text-align:center;
    font-weight:bold;
    display:flex;
    flex-direction:column;
    justify-content:center;
    padding-left: 0.25em;
    padding-right: 0.25em;
    margin-left: 0.25em;
    margin-right: 0.25em;
    box-sizing: border-box;
`

const HeaderButton = styled(HeaderContent)`
    /* background-color:rgba(0,0,0,0.15); */
    /* margin-left:0.5em; */
    border: outset 3px #8040129e;
    border-radius: 7px;
    margin-top:2.5px;
    margin-bottom:2.5px;
    
    &:hover {
        /* line-height:103%; */
        border: inset 3px #8040129e;
        cursor:pointer;
    }
`


const RightBox = styled("div") `
    display:flex;
`

const LeftBox = styled("div") `
    margin-left: auto;
    margin-right: 1vw;
    display:flex;
`

export default function Header(props : Props) {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useRecoilState(userState)

    const loginreq = () => {
        setLoading(true)
        fetch(API_SERVER+"/twitter/signin", {mode:"same-origin"})
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
                            setLoading(false)
                        }
                    }, 1000);
                }
            })
            .catch((err) => console.error(err));
            }

    const logoutreq = () => {
        fetch(API_SERVER+"/signout", {mode:"same-origin"})
        .then(()=>setUser(null))
        .catch((err) => console.error(err));
    }

    let history = useHistory();
    return (
        <HeaderBox> 
            <RightBox>
            <HeaderButton onClick={()=>{history.push("/")}}>Arena</HeaderButton>
            <HeaderButton onClick={()=>{history.push("/roomlist")}}>Rooms</HeaderButton>
            </RightBox>
            <LeftBox>
            {user!==null && <HeaderContent>{user.name}</HeaderContent> }
            {user!==null && <HeaderButton onClick={logoutreq}>LOGOUT</HeaderButton> }
            {user!==null || (loading ? <HeaderContent><CircularProgress color="inherit"/></HeaderContent> :
                <HeaderButton onClick={loginreq}>LOGIN</HeaderButton> )
            }
            </LeftBox>
        </HeaderBox>
    )
}