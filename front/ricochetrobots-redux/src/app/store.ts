import { enableMapSet } from 'immer';

import { configureStore, ThunkAction, Action, getDefaultMiddleware } from '@reduxjs/toolkit';

import {gameSlice} from "../container/GameSlice"
enableMapSet()


const middleware = getDefaultMiddleware({ serializableCheck: false });
export const store = configureStore({
  reducer: {
    game:gameSlice.reducer,
  },
  middleware,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
