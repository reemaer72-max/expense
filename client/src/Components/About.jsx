import React from "react";

// test1
export const user = {
  name: "Rima",
};

// test2
export const calculateTotal = (expenses) => {
  return expenses.reduce((total, item) => total + item, 0);
};

// 🔢 even number
export const isEven = (num) => num % 2 === 0;

const About = () => {
  return (
    <div>
      <h1>About this project</h1>

      <p>This project is developed by Rima and team.</p>
      <p>Email: rima@gmail.com</p>

      <button>Contact developer</button>
    </div>
  );
};

export default About;