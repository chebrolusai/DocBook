import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "aos/dist/aos.css";
import "bootstrap/dist/js/bootstrap";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Routes from "./PageRoutes";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./dist/main.css";

import i18n from "./internationalisation";
import { I18nextProvider } from "react-i18next";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <I18nextProvider i18n={i18n}>
          <Routes />
        </I18nextProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
