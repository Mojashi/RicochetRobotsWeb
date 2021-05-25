//ユーザー

export type UserID = number

export interface User{
	id : UserID,
	name : string,
	twitterID : string,
	arenaWinCount : number,
}

export const UserExample = (id:UserID):User=>({id:id,name: "test_user", twitterID:"00001200120", arenaWinCount:0})
export const UnknownUser:User = {id:-1,name: "unknown", twitterID:"", arenaWinCount:0}
export const AnonymousUser:User = {id:-1,name: "guest", twitterID:"", arenaWinCount:0}