import { PayloadAction } from "@reduxjs/toolkit"
import produce from "immer"
import { User } from "../../model/User"
import { State } from "../GameSlice"

export const SiteReducers = [
    setUser: (state : State, action : PayloadAction<User>) => (
        produce(state, draft => {
            draft.siteState.user = action.payload
        })
    ),
]