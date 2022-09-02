import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./app/app";
import { setupStore } from "./app/store/store";
import "./styles/main.scss";

const container = document.getElementById("root");
if (container) {
  const store = setupStore();
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}
