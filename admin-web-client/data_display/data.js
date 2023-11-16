//import Image from 'next/image'
"use client";
import "./stylePage.css";
import React from 'react';
import ImageListData, { FetchButton, SendVerifiedButton } from "./display-data";
import NavBar from "./NavBar";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { pink, purple } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: purple,
    secondary: pink
  },
  typography: {
    fontFamily: 'Quicksand',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600
  }
})

export default function Home() {

  return (
  <ThemeProvider theme={theme}>
    <html>
      <head>
      </head>
      <div className="data-list" >
        <NavBar/><br/>
        <ImageListData/>
      </div>
    </html>
  </ThemeProvider>
  );
}

