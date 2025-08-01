
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


const authHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
};


export const fetchBalance = createAsyncThunk('balance/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('https://take-home-test-api.nutech-integrasi.com/balance', authHeaders());
    if (res.data.status !== 0) {
      return rejectWithValue(res.data.message || 'Gagal mengambil saldo');
    }
    return res.data.data.balance;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Async thunk: top up saldo
export const topUp = createAsyncThunk('balance/topup', async (amount, { rejectWithValue }) => {
  try {
    if (typeof amount !== 'number' || amount <= 0) {
      return rejectWithValue('Top up amount harus angka dan lebih dari 0');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('Token tidak ditemukan. Silakan login ulang.');
    }

    const res = await axios.post(
      'https://take-home-test-api.nutech-integrasi.com/topup',
      { top_up_amount: amount },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.status !== 0) {
      return rejectWithValue(res.data.message || 'Gagal top up');
    }

    return res.data.data.balance;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});


const balanceSlice = createSlice({
  name: 'balance',
  initialState: {
    saldo: 0,
    status: 'idle',
    error: null,
  },
  reducers: {
  kurangiSaldo: (state, action) => {
    const jumlah = action.payload;
    if (typeof jumlah === 'number' && jumlah > 0) {
      state.saldo -= jumlah;
    }
  },
},
  
  extraReducers: builder => {
    builder
      .addCase(fetchBalance.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.saldo = action.payload;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(topUp.fulfilled, (state, action) => {
        state.saldo = action.payload;
      });
  },
});
export const { kurangiSaldo } = balanceSlice.actions;
export default balanceSlice.reducer;
