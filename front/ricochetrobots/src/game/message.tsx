import { CSSProperties } from "@material-ui/core/styles/withStyles"
import { Dispatch } from "react"
import { SubmissionModel } from "../shared/submission"

export interface Message {Message:string, timeout : number, style : CSSProperties, onTimeout : ()=>void}

export const TimeUpMsg = (setSubs:Dispatch<React.SetStateAction<SubmissionModel[]>>):Message => ({
    Message:"TIME UP",
    timeout:3000,
    style:{
        textShadow: "9px 10px darkred",
        color: "orangered"
    }, 
    onTimeout:()=>{
        setSubs([])
    }
})

export const OptimalMsg:Message = {
    Message:"OPTIMAL",
    timeout:2000,
    style:{
        textShadow: "9px 10px lightgreen",
        color: "lightseagreen"
   }, 
   onTimeout:()=>{}
}

export const WaitingMsg :Message = {
    Message:"Wait For The NextGame",
    timeout:99999999,
    style :{
        textShadow: "9px 10px lightgreen",
        color: "lightseagreen"
    }, 
    onTimeout:()=>{}
}