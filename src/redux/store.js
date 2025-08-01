import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import profileReducer from "./profile/profileSlice";
// import balanceReducer from "./balance/balanceSlice";
import transaksiReducer from "./transaksi/TransaksiSlice";
import transaksiSlicer from "./transaksi/transaksiHistorySlice";
import { loadState } from "./localStorage";

const persistedState = loadState();


export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    // balance: balanceReducer,
    transaksiHistory: transaksiSlicer,
    transaksi: transaksiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
  preloadedState: {
    transaksi: persistedState, // sesuai slice yang ingin dipersist
  },
});

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("transaksiState", JSON.stringify(state.transaksi));
});
