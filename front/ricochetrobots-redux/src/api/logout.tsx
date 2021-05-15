import { setUser } from "../container/GameSlice";
import { API_SERVER } from "./api";

export function logoutApi(setUserToNull : ()=>void) {
    fetch(API_SERVER+"/signout", {mode:"same-origin"})
    .then(setUserToNull)
    .catch((err) => console.error(err));
}