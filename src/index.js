import React from "react";
import ReactDOM from "react-dom/client";
// import { BrowserRouter as Router } from "react-router-dom";
import { HashRouter as Router } from "react-router-dom"; // 깃허브 페이지는 브라우저라우터 안 먹음, 해쉬로 변경

import App from "./components/App";
// import firebase from "./fBase";
import "./styles.css";

// console.log(firebase);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <Router basename={process.env.PUBLIC_URL}>
  <Router base="/">
    <App />
  </Router>
);
