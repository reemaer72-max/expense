import React from "react";
import "../App.css";

const AboutO = () => {
  const team = [
    {
      name: "Aaisha Albreiki",
      role: "Project Manager",
      initial: "A",
    },
    {
      name: "Israa Alsharqi",
      role: "Backend Developer",
      initial: "I",
    },
    {
      name: "Bashayer Alrisi",
      role: "UI/UX Designer",
      initial: "B",
    },
    {
      name: "Rima Alzaabi",
      role: "Frontend Developer",
      initial: "R",
    },
  ];

  return (
    <div className="about-container">
      <h1>About Our Team</h1>

      <p className="about-text">
        We are a passionate team dedicated to helping users manage their
        finances easily and effectively. Our goal is to provide a simple,
        secure, and user-friendly platform for tracking personal expenses and
        improving financial habits.
      </p>

      <div className="team-grid">
        {team.map((member, index) => (
          <div key={index} className="team-card">
            <div className="avatar">{member.initial}</div>
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutO;
