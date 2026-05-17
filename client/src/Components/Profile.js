import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../Features/UserSlice";
import { getStoredUser } from "../utils/storage";
import Location from "./Location";
const Profile = () => {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.users.user);
  const [user, setUser] = useState(null);
  const [income, setIncome] = useState(0);
  const currentUser = reduxUser || getStoredUser();

  useEffect(() => {
    if (!currentUser?._id && !currentUser?.email) {
      return;
    }

    axios
      .get(`/getUser/${currentUser._id || currentUser.email}`)
      .then((res) => {
        setUser(res.data.user);
        setIncome(res.data.user?.income || 0);
      })
      .catch((err) => {
        console.log("Error fetching user:", err);
      });
  }, [currentUser?._id, currentUser?.email]);

  const handleUpdate = () => {
    if (!user?.email) {
      alert("User data is not available");
      return;
    }

    axios
      .put("/updateIncome", {
        email: user.email,
        income: Number(income),
      })
      .then((res) => {
        setUser(res.data.user);
        setIncome(res.data.user?.income || 0);
        dispatch(setCurrentUser(res.data.user));
        alert("Income updated successfully");
      })
      .catch((err) => {
        console.log(err);
        alert("Error updating income");
      });
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow">
        <h2 className="mb-3">Profile</h2>

        {user ? (
          <>
            <p>
              <strong>Name:</strong> {user.name}
            </p>

            <p>
              <strong>Email:</strong> {user.email}
            </p>

            <p>
              <strong>Current Income:</strong> {user.income}
            </p>

            <Location />
            <input
              type="number"
              className="form-control mb-3"
              placeholder="Enter Monthly Income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />

            <button className="btn btn-primary w-100" onClick={handleUpdate}>
              Save
            </button>
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;