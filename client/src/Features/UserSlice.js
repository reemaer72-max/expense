import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from "../utils/storage";

const initialState = {
  user: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/registerUser", userData, {
        withCredentials: true,
      });
      return res.data.user;
    } catch (err) {
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);
      console.log("MESSAGE:", err.message);

      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const login = createAsyncThunk(
  "users/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("/login", data);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Login failed");
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "users/fetchCurrentUser",
  async (identifier, { rejectWithValue }) => {
    try {
      const storedUser = getStoredUser();
      const userIdentifier = identifier || storedUser?._id || storedUser?.email;

      if (!userIdentifier) {
        throw new Error("User not found");
      }

      const res = await axios.get(`/getUser/${userIdentifier}`);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || "Failed to load user",
      );
    }
  },
);

export const logout = createAsyncThunk("users/logout", async () => {
  await axios.post("/logout");
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.user = action.payload;
      setStoredUser(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.error = null;
        state.user = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.error = null;
        state.user = action.payload;
        setStoredUser(action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.error = null;
        state.user = action.payload;
        setStoredUser(action.payload);
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
        clearStoredUser();
      });
  },
});

export const { setCurrentUser } = userSlice.actions;
export default userSlice.reducer;
