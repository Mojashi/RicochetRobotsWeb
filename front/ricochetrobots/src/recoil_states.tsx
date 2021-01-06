
import User from "./shared/user"
import { fetchMeAPI } from "./util"

import { atom, useSetRecoilState } from "recoil"

export const userState = atom<User | null>({
    key: "userState",
    default: null
})

export function fetchMe(setUser:any) {
    // const setUser = useSetRecoilState(userState)
    fetchMeAPI()
    .then((user) => setUser(user))
    .catch((err)=>{console.log("aaa"+err);setUser(null)});
}