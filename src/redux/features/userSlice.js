import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "User",
  initialState: {
    user: null,
    favoriteList: [],
  },
  reducers: {
    setUser: (state, action) => {
      if (action.payload === null) {
        localStorage.removeItem("actkn");
      } else {
        if (action.payload.access_token)
          localStorage.setItem("actkn", action.payload.access_token);
      }
      state.user = action.payload;
    },
    setFavoriteList: (state, action) => {
      state.favoriteList = action.payload;
    },
    addFavorite: (state, action) => {
      state.favoriteList.push(action.payload);
    },
    removeFavorite: (state, action) => {
      state.favoriteList = state.favoriteList.filter(
        (favorite) => favorite.id !== action.payload.id
      );
    },
  },
});

export const { setUser, setFavoriteList, addFavorite, removeFavorite } =
  userSlice.actions;

export default userSlice.reducer;

// Selector Helper
export const selectUser = (state) => state.user;
export const selectFavoriteList = (state) => state.user.favoriteList;
