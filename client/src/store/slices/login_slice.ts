import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    user: string | null;
    loggedIn: boolean;
  }

const initialState: UserState = {
    user: null,
    loggedIn: false,
  };

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ type: string; loggedIn: boolean }>) => {
          state.user = action.payload.type;
          state.loggedIn = true;
        },
        logout: (state) => {
          state.user = null;
          state.loggedIn = false;
        },
    },
});

export const { login, logout } = userSlice.actions;
export const selectUser = (state: { user: UserState }) => state.user.user;
export default userSlice.reducer;