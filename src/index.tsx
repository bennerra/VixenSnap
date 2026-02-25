import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import { store } from "@/store";
import { ThemeProvider } from "@/context";

import { NotificationLayout } from "@/context/NotificationContext";
import { App } from "./modules/App";

import "./index.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Router>
    <ThemeProvider>
      <NotificationLayout>
        <Provider store={store}>
          <App />
        </Provider>
      </NotificationLayout>
    </ThemeProvider>
  </Router>
);
