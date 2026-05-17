import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getStoredUser } from "../utils/storage";

const getCurrentUser = () => {
  const user = getStoredUser();

  if (!user?._id) {
    throw new Error("Please log in again");
  }

  return user;
};

export const getExpenses = createAsyncThunk(
  "expenses/getExpenses",
  async (_, thunkAPI) => {
    try {
      const user = getCurrentUser();
      const response = await axios.get("/getExpenses", {
        params: { userId: user._id },
      });
      return response.data.expenses;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Error fetching expenses",
      );
    }
  },
);

export const addExpense = createAsyncThunk(
  "expenses/addExpense",
  async (expenseData, thunkAPI) => {
    try {
      const user = getCurrentUser();
      const response = await axios.post("/addExpense", {
        ...expenseData,
        userId: user._id,
        userEmail: user.email,
      });
      return response.data.expense;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Error adding expense",
      );
    }
  },
);

export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const user = getCurrentUser();
      const response = await axios.put(`/updateExpense/${id}`, {
        ...updatedData,
        userId: user._id,
      });
      return response.data.expense;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Error updating expense",
      );
    }
  },
);

export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async (id, thunkAPI) => {
    try {
      const user = getCurrentUser();
      await axios.delete(`/deleteExpense/${id}`, {
        params: { userId: user._id },
      });
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Error deleting expense",
      );
    }
  },
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    expenses: [],
    loading: false,
    error: null,
    userId: null,
  },
  reducers: {
    resetExpenses: (state) => {
      state.expenses = [];
      state.loading = false;
      state.error = null;
      state.userId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.expenses = [];
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        const user = getStoredUser();
        state.loading = false;
        state.expenses = action.payload;
        state.userId = user?._id || null;
      })
      .addCase(getExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.expenses = [];
        state.userId = null;
      })
      .addCase(addExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        const user = getStoredUser();
        state.loading = false;
        state.expenses.unshift(action.payload);
        state.userId = user?._id || state.userId;
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.expenses.findIndex(
          (expense) => expense._id === action.payload._id,
        );

        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = state.expenses.filter(
          (expense) => expense._id !== action.payload,
        );
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
