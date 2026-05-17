import React from "react";
import { useSelector } from "react-redux";

const User = () => {
  const user = useSelector((state) => state.users.user);

  const img = user?.profilePic
    ? `/uploads/${user.profilePic}`
    : "https://via.placeholder.com/100";

  return (
    <div className="userInfos">
      <img src={img} className="userImage center" alt="user" />

      <p>
        <b>{user?.name}</b>
        <br />
        {user?.email}
      </p>
    </div>
  );
};

export default User;
