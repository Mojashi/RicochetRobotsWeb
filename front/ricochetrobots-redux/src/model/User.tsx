//ユーザー

export type UserID = number

export interface User{
    id : UserID,
    name : string,
    twitterID : string,
}

export const UserExample = (id:UserID):User=>({id:id,name: "test_user", twitterID:"00001200120"})
export const UnknownUser:User = {id:-1,name: "unknown", twitterID:""}
export const AnonymousUser:User = {id:-1,name: "guest", twitterID:""}