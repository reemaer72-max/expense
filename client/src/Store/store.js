import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../Features/UserSlice";
import expenseReducer from "../Features/ExpenseSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    expenses: expenseReducer,
  },
});
