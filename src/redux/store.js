import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import notLoggedInModalSlice from "./features/notLoggedInModalSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    notLoggedInModal: notLoggedInModalSlice,
  },
});

export default store;
