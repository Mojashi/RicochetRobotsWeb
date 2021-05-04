import { User, UserExample } from "../User";
import { Hands } from "./Hands";

export type Submission = {
    id : number,
    user : User,
    hands? : Hands,
    length: number,
    timeStamp : number,
    optimal : boolean,
}

export const SubSample:Submission = {id:0, user:UserExample(0), hands:[],length:0, timeStamp:0, optimal:false}
export const OptSubSample:Submission = {id:0, user:UserExample(0), hands:[],length:0, timeStamp:0, optimal:true}
