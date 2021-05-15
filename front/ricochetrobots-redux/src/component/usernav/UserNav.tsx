import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { UserNavPop } from "../../container/UserNavPop";
import { User } from "../../model/User";
import { UserIcon } from "../accessory/UserIcon"


type Props = {
    // onClick? : ()=>void,
    className? : string,
    children? : React.ReactNode,
    user? : User
}


function useOutsideClick(ref : React.RefObject<HTMLDivElement>, onClick:()=>void) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        const handleClickOutside = (event : Event) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClick();
            }
        } 

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, onClick]);
}

export function UserNavView({children, className, user} : Props){
    const [pushed, setPushed] = useState(false);
    const [hover, setHover] = useState(false);
    const [openPop, setOpenPop] = useState(false);
    const ref = useRef(null);
    useOutsideClick(ref, ()=>{setOpenPop(false)});
    const onClick = ()=>{
        setOpenPop(s=>!s);
    }

    return (
        <div ref={ref} className={className}>
        <Div className={(pushed ? " pushed":"") + (hover ? " hover":"")} 
            onClick={onClick} onMouseDown={()=>setPushed(true)} onMouseUp={()=>setPushed(false)}
            onMouseLeave={()=>{setPushed(false);setHover(false);}}
            onMouseEnter={()=>setHover(true)}>
            <UserIconStyled userID={user?.id}/>
        </Div>
        {openPop && <UserNavPop/>}
        </div>
    )
}

const UserIconStyled = styled(UserIcon)`
    height:100%;
    width:100%;
`
const Div = styled("div")`
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    height:3.2em;
    width:3.2em;
    border-radius: 100%;
    overflow:hidden;
    margin-right:1em;
    cursor: pointer;
    &.disable {

    }
    &.hover{
        /* height:3.5em;
        width:3.5em; */
    }
    &.pushed {
        box-shadow: none;
        margin-top:0.2em;
    }
    transition:all 0.1s;
`