import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchHistory = createAsyncThunk(
  "transaksiHistory/fetchHistory",
  async ({ offset, limit }) => {
    const response = await axios.get(`/history?offset=${offset}&limit=${limit}`);
    // Contoh response API bisa berupa array langsung atau objek { data: [...] }
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      return [];
    }
  }
);

const initialState = {
  list: [],
  status: "idle",
  error: null,
  offset: 0,
  limit: 5,
  hasMore: true,
};

const transaksiSlicer = createSlice({
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
        state.error = action.error.message;
      });
  },
});

export const { resetHistory } = transaksiSlicer.actions;

export default transaksiSlicer.reducer;
