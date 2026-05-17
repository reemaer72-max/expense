import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import App from "./App";

import { Provider } from "react-redux";
import { store } from "./Store/store";

axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:3002";
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
