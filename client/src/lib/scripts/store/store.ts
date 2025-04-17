import {configureStore} from "@reduxjs/toolkit";
import userSlice from "./slices/user-slice";

const store = configureStore({
  reducer: {
    user: userSlice
  },
  devTools: process.env.NODE_ENV !== "production",
})

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;