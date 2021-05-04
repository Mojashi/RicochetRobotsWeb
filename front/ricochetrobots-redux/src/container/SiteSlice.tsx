//ユーザとか言語とか

import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import produce, { current } from "immer"
import { RootState } from "../app/store"
import { User, AnonymousUser } from "../model/User"

type SiteState = {
    user : User,
}

const initialState :SiteState = {
    user : AnonymousUser,
}

const slice = createSlice({
    name: 'site',
    initialState,
    reducers: {
        setUser: (state, action : PayloadAction<User>) => (
            produce(state, draft => {
                draft.user = action.payload
            })
        ),
    },
})

export const {setUser} = slice.actions

const selectSelf = (state : RootState) => state.site
export const userSelector = createSelector(selectSelf, state=>state.user)
export const loggedInSelector = createSelector(selectSelf, state=>state.user !== AnonymousUser)

export const siteSlice = slice