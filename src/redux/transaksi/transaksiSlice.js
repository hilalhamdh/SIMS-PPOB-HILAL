// features/transaksi/transaksiSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios
 from 'axios';
export const fetchHistory = createAsyncThunk(
  'transaksi/history',
  async ({ offset = 0, limit = 3 } = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `https://take-home-test-api.nutech-integrasi.com/transaction/history?offset=${offset}&limit=${limit}`,
        getAuthHeader()
      );

      if (res.data.status !== 0) {
        return rejectWithValue(res.data.message || 'Gagal mengambil data history');
      }

      return res.data.data.records; // penting: gunakan .records
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};
export const pay = createAsyncThunk('transaksi/pay', async ({ service_code }, { rejectWithValue }) => {
  try {
    const res = await axios.post(
      'https://take-home-test-api.nutech-integrasi.com/transaction',
      { service_code },
      getAuthHeader()
    );

    if (res.data.status !== 0) {
      return rejectWithValue(res.data.message || 'Gagal melakukan transaksi');
    }

    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const transaksiSlice = createSlice({
  name: 'transaksi',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload; // data = array of records
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(pay.fulfilled, (state, action) => {
        // Optional: tambahkan transaksi baru ke list history (jika ingin)
        state.list.unshift(action.payload);
      });
  },
});


export default transaksiSlice.reducer;
