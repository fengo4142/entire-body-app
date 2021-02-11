import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import reduxStore from "./Redux";
import App from "./App";
import "./i18n";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={reduxStore}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
