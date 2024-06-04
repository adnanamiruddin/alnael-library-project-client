import { createSlice } from "@reduxjs/toolkit";

export const notLoggedInModalSlice = createSlice({
  name: "NotLoggedInModal",
  initialState: {
    notLoggedInModalOpen: false,
  },
  reducers: {
    setNotLoggedInModalOpen: (state, action) => {
      state.notLoggedInModalOpen = action.payload;
    },
  },
});

export const { setNotLoggedInModalOpen } = notLoggedInModalSlice.actions;

export default notLoggedInModalSlice.reducer;

// Selector Helper
export const selectNotLoggedInModal = (state) => state.notLoggedInModal;
