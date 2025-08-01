import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import profileReducer from "./profile/profileSlice";
import balanceReducer from "./balance/balanceSlice";
import transaksiReducer from "./transaksi/transaksiSlicee";
import transaksiSlicer from "./transaksi/transaksiHistorySlice";





export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    balance: balanceReducer,
    transaksiHistory: transaksiSlicer,
    transaksi: transaksiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
 
});

