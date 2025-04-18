import { User } from "@/lib/types/user";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { backend, IResponse } from "@scripts/backend";
import { AxiosResponse } from "axios";
import { deleteCookie, setCookie, getCookie } from "cookies-next";

export interface UserState {
  domReady: boolean;
  user: User | null;
  token: string | null;
}

const initialState: UserState = {
  domReady: false,
  user: null,
  token: null,
};

export const loginUser = createAsyncThunk<User, { token: string }>(
  "user/loginUser",
  async ({ token }, { dispatch, rejectWithValue }) => {
    dispatch(setToken(token));
    setCookie("authorization", `Bearer ${token}`, {
      maxAge: 60 * 60 * 12, // 12 hours
    });

    try {
      const res: AxiosResponse<IResponse<User>> = await backend.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.data.data) {
        throw new Error("User data is missing");
      }
      dispatch(setUser(res.data.data));
      return res.data.data;
    } catch (error) {
      clearAuthState();
      return rejectWithValue((error as Error).message);
    } finally {
      dispatch(setDomReady(true));
    }
  }
);

export const checkUser = createAsyncThunk<User, void>(
  "user/checkUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const auth = await getCookie("authorization");
      if (!auth) {
        throw new Error("Authorization token is missing");
      }
      const res: AxiosResponse<IResponse<User>> = await backend.get("/user", {
        headers: {
          Authorization: auth,
        },
      });
      if (!res.data.data) {
        throw new Error("User data is missing");
      }
      dispatch(setUser(res.data.data));
      return res.data.data;
    } catch (error) {
      clearAuthState();
      return rejectWithValue((error as Error).message);
    } finally {
      dispatch(setDomReady(true));
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setDomReady: (state, action) => {
      state.domReady = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearAuthState: (state) => {
      state.user = null;
      state.token = null;
      deleteCookie("authorization");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(checkUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { setDomReady, setUser, setToken, clearAuthState } =
  userSlice.actions;
export default userSlice.reducer;
