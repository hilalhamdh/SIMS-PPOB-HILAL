import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchHistory = createAsyncThunk(
  "transaksiHistory/fetchHistory",
  async ({ offset, limit }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://take-home-test-api.nutech-integrasi.com/transaction/history?offset=${offset}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await res.json();
      console.log("✅ Fetch History response:", data);

      if (!res.ok || data.status !== 0) {
        return rejectWithValue(data.message || "Error fetching history");
      }

      // ✅ Ambil data dari data.records
      return Array.isArray(data.data?.records) ? data.data.records : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const transaksiHistorySlice = createSlice({
  name: "transaksiHistory",
  initialState: {
    list: [],
    status: "idle",
    error: null,
    offset: 0,
    limit: 5,
    hasMore: true,
  },
  reducers: {
    // Tidak perlu resetHistory kalau tidak mau reset data
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
          // Load awal, ganti list
          state.list = action.payload;
        } else {
          // Load more, tambah ke list
          state.list = [...state.list, ...action.payload];
        }

        state.offset += action.payload.length;
        state.hasMore = action.payload.length === state.limit;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default transaksiHistorySlice.reducer;
