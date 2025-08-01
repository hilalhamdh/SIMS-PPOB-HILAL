import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



export const fetchHistory = createAsyncThunk(
  "transaksiHistory/fetchHistory",
  async ({ offset, limit }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/history?offset=${offset}&limit=${limit}`);
      console.log("✅ API Response:", response.data); 

      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error("❌ Fetch error:", error); // <-- DEBUG error
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  list: [],
  status: "idle", 
  offset: 0,
  limit: 5,
  hasMore: true,
};

const transaksiSlicerr = createSlice({
  name: "transaksiHistory",
  initialState,
  reducers: {
    resetHistory: (state) => {
      state.list = [];
      state.offset = 0;
      state.hasMore = true;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (!Array.isArray(action.payload)) {
          state.list = [];
          state.hasMore = false;
          return;
        }

        if (action.meta.arg.offset === 0) {
          state.offset = 0;
          state.list = action.payload;
        } else {
          state.list = [...state.list, ...action.payload];
        }

        state.offset += action.payload.length;
        state.hasMore = action.payload.length === state.limit;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Terjadi kesalahan saat memuat data.";
      });
  },
});

export const { resetHistory } = transaksiSlicerr.actions;
export default transaksiSlicerr.reducer;
