import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Helper: ambil token dan siapkan header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch profile
export const fetchProfile = createAsyncThunk(
  'profile/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        'https://take-home-test-api.nutech-integrasi.com/profile',
        getAuthHeader()
      );
      if (res.data.status !== 0) {
        return rejectWithValue(res.data.message || 'Gagal mengambil profile');
      }
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update profile image
export const updateProfileImage = createAsyncThunk(
  'profile/updateImage',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        'https://take-home-test-api.nutech-integrasi.com/profile/image',
        formData,
        {
          ...getAuthHeader(),
          headers: {
            ...getAuthHeader().headers,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.data.status !== 0) {
        return rejectWithValue(response.data.message || 'Gagal update gambar');
      }
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update profile data (name, email)
export const updateProfile = createAsyncThunk(
  'profile/update',
  async (updatedData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        'https://take-home-test-api.nutech-integrasi.com/profile',
        updatedData,
        getAuthHeader()
      );
      if (response.data.status !== 0) {
        return rejectWithValue(response.data.message || 'Gagal update profile');
      }
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
    updateStatus: 'idle',
    updateError: null,
    imageUploadStatus: 'idle',
    imageUploadError: null,
  },
  reducers: {
    clearProfile: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update profile (first_name, last_name, email)
      .addCase(updateProfile.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.data = { ...state.data, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload;
      })

   
      .addCase(updateProfileImage.pending, (state) => {
        state.imageUploadStatus = 'loading';
        state.imageUploadError = null;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.imageUploadStatus = 'succeeded';
        state.data.profile_image = action.payload.profile_image;
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.imageUploadStatus = 'failed';
        state.imageUploadError = action.payload;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
