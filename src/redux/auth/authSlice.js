
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';



export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch('https://take-home-test-api.nutech-integrasi.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (!response.ok || result.status !== 0) {
        return rejectWithValue(result.message || 'Login gagal');
      }

      const token = result.data.token;
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const register = createAsyncThunk(
  'auth/register',
  async (form, { rejectWithValue }) => {
    try {
      const res = await fetch('https://take-home-test-api.nutech-integrasi.com/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Registrasi gagal');
      }

      return await res.json(); 
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
    .addCase(register.fulfilled, (state) => {
  state.status = 'register_success';
  state.token = null;          
  localStorage.removeItem('token');  
})
.addCase(register.rejected, (state, action) => {
  state.status = 'register_failed';
  state.error = action.payload;
  state.token = null;         
  localStorage.removeItem('token');
})

  },
});


export const { logout } = authSlice.actions;
export default authSlice.reducer;
