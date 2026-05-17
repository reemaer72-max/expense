import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Home from "./Components/Home";
import Header from "./Components/Header";
import EditExpense from "./Components/EditExpense";
import AddExpense from "./Components/AddExpense";
import ExpenseList from "./Components/ExpenseList";
import Profile from "./Components/Profile";
import About from "./Components/About";
import { fetchCurrentUser } from "./Features/UserSlice";
import ProtectedRoute from "./ProtectedRoute";
import { getStoredUser } from "./utils/storage";

function App() {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.users.user);
  const storedUser = getStoredUser();
  const user = reduxUser || storedUser;

  useEffect(() => {
    if (
      storedUser?._id &&
      (!reduxUser || String(reduxUser._id) !== String(storedUser._id))
    ) {
      dispatch(fetchCurrentUser(storedUser._id));
    }
  }, [dispatch, reduxUser, storedUser?._id]);

  return (
    <Router>
      <div className="app-shell">
        {user && <Header />}

        <main className={user ? "main-content" : "auth-content"}>
          <Routes>
            <Route
              path="/"
              element={<Navigate to={user ? "/home" : "/login"} replace />}
            />
            <Route
              path="/login"
              element={user ? <Navigate to="/home" replace /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/home" replace /> : <Register />}
            />

            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <ExpenseList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-expense"
              element={
                <ProtectedRoute>
                  <AddExpense />
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit-expense/:id"
              element={
                <ProtectedRoute>
                  <EditExpense />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={<Navigate to={user ? "/home" : "/login"} replace />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
