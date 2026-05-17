import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteExpense,
  getExpenses,
  resetExpenses,
} from "../Features/ExpenseSlice";
import { getStoredUser } from "../utils/storage";

const ExpenseList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = getStoredUser();
  const expenses = useSelector((state) => state.expenses.expenses || []);
  const { loading, error } = useSelector((state) => state.expenses);
  const visibleExpenses = expenses.filter(
    (expense) => String(expense.userId) === String(user?._id),
  );

  useEffect(() => {
    if (!user?._id) {
      dispatch(resetExpenses());
      return;
    }

    dispatch(resetExpenses());
    dispatch(getExpenses());
  }, [dispatch, user?._id]);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Expense List</h2>

      <button
        className="btn btn-success mb-3"
        onClick={() => navigate("/add-expense")}
      >
        + Add Expense
      </button>

      {error && <div className="alert alert-danger mb-3">{String(error)}</div>}

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Title</th>
            <th>Notes</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center">
                Loading expenses...
              </td>
            </tr>
          ) : visibleExpenses.length > 0 ? (
            visibleExpenses.map((expense) => (
              <tr key={expense._id}>
                <td>{expense.date}</td>
                <td>{expense.category}</td>
                <td>{expense.title || expense.description || "-"}</td>
                <td>{expense.notes || "-"}</td>
                <td>{expense.amount}</td>

                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => navigate(`/edit-expense/${expense._id}`)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => dispatch(deleteExpense(expense._id))}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No expenses found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
