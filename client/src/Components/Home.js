import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { getExpenses, resetExpenses } from "../Features/ExpenseSlice";
import { getStoredUser } from "../utils/storage";

ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allExpenses = useSelector((state) => state.expenses.expenses || []);
  const { loading, error } = useSelector((state) => state.expenses);
  const reduxUser = useSelector((state) => state.users.user);
  const user = reduxUser || getStoredUser();
  const expenses = allExpenses.filter(
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

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0,
  );

  const income = Number(user?.income || 0);
  const balance = income - totalExpenses;
  const recentExpenses = [...expenses].slice(0, 5);
  const safeBalance = Math.max(balance, 0);
  const overspent = Math.max(totalExpenses - income, 0);

  const formatCurrency = (value) => `${Number(value || 0).toFixed(2)} OMR`;

  const chartData = {
    labels: ["Expenses", "Available Balance", "Overspent"],
    datasets: [
      {
        data: [totalExpenses, safeBalance, overspent],
        backgroundColor: ["#ef6c57", "#2e7d32", "#2364aa"],
        borderColor: ["#ffffff", "#ffffff", "#ffffff"],
        borderWidth: 4,
        hoverOffset: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label(context) {
            return `${context.label}: ${formatCurrency(context.raw)}`;
          },
        },
      },
    },
  };

  return (
    <section className="dashboard-page">
      <div className="dashboard-hero">
        <div>
          <p className="dashboard-eyebrow">Overview</p>
          <h1 className="dashboard-title">
            {user?.name ? `Welcome back, ${user.name}` : "Expense Dashboard"}
          </h1>
          <p className="dashboard-subtitle">
            Review your income, track spending, and jump to the next action
            from one clear dashboard.
          </p>
        </div>

        <div className="dashboard-actions">
          <button className="button" onClick={() => navigate("/add-expense")}>
            Add Expense
          </button>
          <button
            className="button button-secondary"
            onClick={() => navigate("/profile")}
          >
            Update Income
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <article className="card-box summary-card income-card">
          <span className="summary-label">Monthly Income</span>
          <h3>{formatCurrency(income)}</h3>
          <p>Your planned income for this month.</p>
        </article>

        <article className="card-box summary-card expense-card">
          <span className="summary-label">Total Expenses</span>
          <h3>{formatCurrency(totalExpenses)}</h3>
          <p>The total amount recorded in your expense list.</p>
        </article>

        <article className="card-box summary-card balance-card">
          <span className="summary-label">Remaining Balance</span>
          <h3>{formatCurrency(balance)}</h3>
          <p>What is left after subtracting expenses from income.</p>
        </article>
      </div>

      <div className="dashboard-panels">
        <section className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h2>Quick Understanding</h2>
              <p>A visual summary of your current money distribution.</p>
            </div>
          </div>

          <div className="chart-card">
            <div className="dashboard-chart">
              <Doughnut data={chartData} options={chartOptions} />
              <div className="chart-center-text">
                <span>Status</span>
                <strong>{balance >= 0 ? "Healthy" : "Over budget"}</strong>
              </div>
            </div>

            <div className="chart-legend">
              <div className="chart-legend-item">
                <span className="legend-dot expenses-dot" />
                <div>
                  <small>Expenses</small>
                  <strong>{formatCurrency(totalExpenses)}</strong>
                </div>
              </div>

              <div className="chart-legend-item">
                <span className="legend-dot balance-dot" />
                <div>
                  <small>Available balance</small>
                  <strong>{formatCurrency(safeBalance)}</strong>
                </div>
              </div>

              <div className="chart-legend-item">
                <span className="legend-dot overspent-dot" />
                <div>
                  <small>Overspent</small>
                  <strong>{formatCurrency(overspent)}</strong>
                </div>
              </div>

              <div className="chart-summary">
                <span>Recorded expenses</span>
                <strong>{expenses.length}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h2>Recent Expenses</h2>
              <p>The latest entries help you understand spending faster.</p>
            </div>
            <button
              className="button button-secondary"
              onClick={() => navigate("/expenses")}
            >
              View All
            </button>
          </div>

          {loading ? (
            <p className="panel-message">Loading dashboard data...</p>
          ) : error ? (
            <p className="panel-message error-text">{String(error)}</p>
          ) : recentExpenses.length > 0 ? (
            <div className="recent-expense-list">
              {recentExpenses.map((expense) => (
                <div className="recent-expense-item" key={expense._id}>
                  <div>
                    <h3>{expense.title || expense.description || "Expense"}</h3>
                    <p>
                      {expense.category || "General"} • {expense.date || "No date"}
                    </p>
                  </div>
                  <strong>{formatCurrency(expense.amount)}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="panel-message">
              No expenses added yet. Start by adding your first expense.
            </p>
          )}
        </section>
      </div>
    </section>
  );
};

export default Home;
