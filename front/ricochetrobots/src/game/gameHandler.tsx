import { Dispatch } from "react";
import { SubmissionModel } from "../shared/submission";
import User from "../shared/user";
import { OptimalMsg, Message } from "./message";

type Setter<T> = Dispatch<React.SetStateAction<T>>

export interface GameHandler {
    timelimit:(seconds:number)=>void,
    finish:()=>void,
    submit:(sub:SubmissionModel)=>void,
}

export const gameHandler = (
    setShowTimer:Setter<boolean>,
    setTimeLimit:Setter<{rem:number, onFinish:()=>void} | null>,
    setShowResult:Setter<boolean>,
    setSubs:Setter<SubmissionModel[]>,
    setSending:Setter<boolean>,
    setMsgs:Setter<Message[]>,
    user:User|null,
)=>()=>({
    timelimit:(seconds:number)=>{
        setShowTimer(true)
        setTimeLimit({rem:seconds, onFinish:()=>{}})
    },
    finish:()=>{
        setShowResult(true)
        setShowTimer(false);
        setTimeLimit(null)
    },
    submit:(sub:SubmissionModel)=>{
        console.log("event:submit")
        if(sub.user.id === user?.id){
            if(sub.opt){
                console.log("optimal")
                setMsgs(msgs=>msgs.concat([OptimalMsg]))
            }
            setSending(false)
        }

        setSubs(subs => {
            console.log(subs)
            var nsubs = subs.slice()
            nsubs.push(sub)
            return nsubs //.sort(compSub).slice(0, Math.min(nsubs.length, 5))
        })
    }
})