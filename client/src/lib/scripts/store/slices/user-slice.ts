import { User } from "@/lib/types/user";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { backend, IResponse } from "@scripts/backend";
import { AxiosResponse } from "axios";

interface UserState {
  domReady: boolean;
  user: User | null;
  token: string | null;
}

const initialState: UserState = {
  domReady: false,
  user: null,
  token: null,
};

export const loginUser = createAsyncThunk<User, { username: string, password: string }>(
  "user/loginUser",
  async ({ username, password }, { dispatch }) => {
    return await backend.post("/login", { username, password })
    .then(async (res: AxiosResponse<IResponse<{
      token: string;
    }>>) => {
      const token = res.data.data?.token ?? "";
      dispatch(setToken(token));
      localStorage.setItem("token", token);

      return await backend.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        dispatch(setUser(res.data.data));
        return res.data.data;
      });

    })
  }
);

export const checkUser = createAsyncThunk<User, void>("user/checkUser", async (_, { dispatch, rejectWithValue }) => {
  const token = localStorage.getItem("token");
  if (!token) return rejectWithValue("No token found");
  try {
    const res = await backend.get("/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(setUser(res.data.data));
    dispatch(setDomReady(true));
    return res.data.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

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
      localStorage.removeItem("token");
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(checkUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  }
})

export const { setDomReady, setUser, setToken, clearAuthState } = userSlice.actions;
export default userSlice.reducer;