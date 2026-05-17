import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExpenses, updateExpense } from "../Features/ExpenseSlice";

const EditExpense = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const expenses = useSelector((state) => state.expenses.expenses || []);
  const { loading, error } = useSelector((state) => state.expenses);
  const expense = expenses.find((item) => item._id === id);
  const [data, setData] = useState({
    title: "",
    amount: "",
    date: "",
    category: "",
    notes: "",
  });

  useEffect(() => {
    if (!expenses.length) {
      dispatch(getExpenses());
    }
  }, [dispatch, expenses.length]);

  useEffect(() => {
    if (expense) {
      setData({
        title: expense.title || expense.description || "",
        amount: expense.amount || "",
        date: expense.date || "",
        category: expense.category || "",
        notes: expense.notes || "",
      });
    }
  }, [expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(
      updateExpense({
        id,
        updatedData: {
          ...data,
          amount: Number(data.amount),
        },
      }),
    ).unwrap();

    navigate("/expenses");
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow">
        <h2 className="mb-3">Edit Expense</h2>

        {loading && !expense ? (
          <p>Loading expense...</p>
        ) : !expense ? (
          <p>Expense not found.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{String(error)}</div>}

            <input
              className="form-control mb-2"
              placeholder="Title"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              required
            />

            <input
              className="form-control mb-2"
              placeholder="Amount"
              type="number"
              step="0.01"
              value={data.amount}
              onChange={(e) => setData({ ...data, amount: e.target.value })}
              required
            />

            <input
              className="form-control mb-2"
              type="date"
              value={data.date}
              onChange={(e) => setData({ ...data, date: e.target.value })}
              required
            />

            <input
              className="form-control mb-2"
              placeholder="Category"
              value={data.category}
              onChange={(e) => setData({ ...data, category: e.target.value })}
            />

            <textarea
              className="form-control mb-3"
              placeholder="Notes"
              value={data.notes}
              onChange={(e) => setData({ ...data, notes: e.target.value })}
            />

            <button className="btn btn-primary w-100">Update Expense</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditExpense;
