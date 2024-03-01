"use client";
import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ImageListData from "./pages/display-data";
import VersionHistory from "./pages/verison-control";
import { VersionNavBar, VerifyNavBar } from "./components/NavBar";
import "./stylePage.css";

const theme = createTheme({
  palette: {
    primary: { main: "#5941a9" },
    secondary: { main: "#6d72c3" },
    success: { main: "#147b57" },
    info: { main: "#2365a2" },
    error: { main: "#a24575" },
  },
});

export default function Home() {
  const [isVersionPage, setIsVersionPage] = useState(false);

  const togglePage = () => {
    setIsVersionPage(!isVersionPage);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="data-list">
        {isVersionPage ? (
          <VersionNavBar onToggle={togglePage} />
        ) : (
          <VerifyNavBar onToggle={togglePage} />
        )}
        <br />
        {isVersionPage ? <VersionHistory /> : <ImageListData />}
      </div>
    </ThemeProvider>
  );
}
