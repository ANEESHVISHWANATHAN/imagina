import React from "react";
import Converter from "./components/Converter";

export default function App() {
  return (
    <div style={{
      background: "#0f172a",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <Converter />
    </div>
  );
}
