"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { checkUser, UserState } from "./slices/user-slice";
import store, { AppDispatch } from "./store";

export interface IState {
  user: UserState;
}

function ProviderContainer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkUser());
  }, [dispatch]);

  return children;
}

export default function StoreProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <ProviderContainer>{children}</ProviderContainer>
    </Provider>
  );
}
