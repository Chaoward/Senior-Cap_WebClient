"use client";
import "./stylePage.css";
import React, { useState, useRef  } from "react";
import ImageListData from "./pages/display-data";
import VersionHistory from "./pages/verison-control";
import * as NavBar from "./components/NavBar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepOrange, green, pink, purple } from "@mui/material/colors";



const theme = createTheme({
  palette: {
    primary: {
      main: "#5941a9",
    },
    secondary: {
      main: "#6d72c3",
    },
    success: {
      main: "#147b57",
    },
    info: {
      main: "#2365a2",
    },
    error: {
      main: "#a24575",
    },
  },
  typography: {
    fontFamily: "Quicksand",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
  },
});

export default function Home() {
  const [isVersionPage, setPage] = useState(false);

  const handleToggle = () => {
    setPage(!isVersionPage);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="data-list">
        {isVersionPage ? NavBar.VersionNavBar({onToggle: handleToggle}) : NavBar.VerifyNavBar({onToggle: handleToggle})}
        <br />
        {isVersionPage ? <VersionHistory/> : <ImageListData/>}
      </div>
    </ThemeProvider>
  );
}