import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./components/LeafletFix";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);