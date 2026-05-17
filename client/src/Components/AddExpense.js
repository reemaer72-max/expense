import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addExpense } from "../Features/ExpenseSlice";
import logo from "../Images/logo.jpeg";

export default function AddExpense() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await dispatch(
        addExpense({
          title,
          amount: Number(amount),
          date,
          category,
          notes,
        }),
      ).unwrap();

      alert("Expense added successfully");
      navigate("/expenses");
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="expense-form-page">
      <div className="expense-form-layout">
        <aside className="expense-form-aside">
          <img src={logo} alt="logo" className="expense-form-logo" />
          <p className="expense-form-eyebrow">New Record</p>
          <h1 className="expense-form-title">Add a clear expense entry</h1>
          <p className="expense-form-text">
            Save each purchase with the amount, date, category, and notes so
            your dashboard stays accurate and easy to understand.
          </p>

          <div className="expense-tip-list">
            <div className="expense-tip-item">
              <strong>Use a short title</strong>
              <span>Examples: Grocery, Taxi, Internet bill</span>
            </div>
            <div className="expense-tip-item">
              <strong>Add a category</strong>
              <span>It helps you review spending patterns later.</span>
            </div>
            <div className="expense-tip-item">
              <strong>Keep useful notes</strong>
              <span>Include details only when they help future review.</span>
            </div>
          </div>
        </aside>

        <div className="expense-form-card">
          <div className="expense-form-header">
            <div>
              <p className="expense-form-eyebrow">Expense Form</p>
              <h2>Record personal spending</h2>
              <p>Fill in the details below to add a new expense.</p>
            </div>
            <Link to="/expenses" className="expense-form-link">
              View Expenses
            </Link>
          </div>

          <form onSubmit={onSubmit} className="expense-form">
            <div className="expense-form-grid">
              <div className="expense-field expense-field-wide">
                <label htmlFor="expense-title">Title</label>
                <input
                  id="expense-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter expense title"
                  required
                />
              </div>

              <div className="expense-field">
                <label htmlFor="expense-amount">Amount</label>
                <input
                  id="expense-amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="expense-field">
                <label htmlFor="expense-date">Date</label>
                <input
                  id="expense-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="expense-field expense-field-wide">
                <label htmlFor="expense-category">Category</label>
                <input
                  id="expense-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Food, Travel, Bills..."
                />
              </div>

              <div className="expense-field expense-field-wide">
                <label htmlFor="expense-notes">Notes</label>
                <textarea
                  id="expense-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any helpful note about this expense"
                  rows="5"
                />
              </div>
            </div>

            {error && <div className="expense-form-error">{error}</div>}

            <div className="expense-form-footer">
              <p className="expense-form-helper">
                Every saved expense will appear in your personal expense list
                and dashboard.
              </p>

              <div className="expense-form-actions">
                <Link to="/expenses" className="expense-form-link muted-link">
                  Cancel
                </Link>
                <button
                  className="button expense-submit-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Expense"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
