import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "./redux/store";
import { Provider as ReduxProvider } from "react-redux";
// import { Web3Provider } from './Context/Web3Context';
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      {/* <Web3Provider> */}
      <App />
      {/* </Web3Provider> */}
    </ReduxProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
