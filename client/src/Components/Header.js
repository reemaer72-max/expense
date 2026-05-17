import { NavLink, useNavigate } from "react-router-dom";
import "../App.css";
import logo from "../Images/logo.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Features/UserSlice";
import { resetExpenses } from "../Features/ExpenseSlice";
import { getStoredUser } from "../utils/storage";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxUser = useSelector((state) => state.users.user);
  const user = reduxUser || getStoredUser();
  const navItems = [
    { to: "/home", label: "Dashboard" },
    { to: "/expenses", label: "Expenses" },
    { to: "/profile", label: "Profile" },
    { to: "/about", label: "About" },
  ];

  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(resetExpenses());
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <header className="header">
      <div className="header-branding">
        <button
          type="button"
          className="brand brand-button"
          onClick={() => navigate("/home")}
        >
          <img src={logo} alt="logo" className="logo" />
          <span className="brand-copy">
            <span className="app-title">Expense App</span>
            <span className="app-subtitle">
              Simple tracking for your daily budget
            </span>
          </span>
        </button>
      </div>

      <nav className="header-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `nav-link header-link${isActive ? " active-nav-link" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="header-actions">
        <div className="header-user">
          <span className="header-user-label">Signed in as</span>
          <strong>{user?.name || user?.email || "User"}</strong>
        </div>

        <button
          type="button"
          className="button header-action-btn"
          onClick={() => navigate("/add-expense")}
        >
          Add Expense
        </button>

        <button onClick={handleLogout} className="logout-btn" type="button">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
