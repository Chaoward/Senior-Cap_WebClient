"use client";
import "./stylePage.css";
import React, { useState, useRef  } from "react";
import ImageListData, { FetchButton, SendVerifiedButton } from "./display-data";
import NavBar from "./NavBar";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const imagePreviewRef = useRef(null);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImagePreview(e.target.result);
        openModal();
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="data-list">
        <NavBar />
        <br />
        <ImageListData openModal={openModal} />

        {modalOpen && (
          <div className="modal" onClick={closeModal}>
            <span className="close">&times;</span>
            {imagePreview && (
              <img
                ref={imagePreviewRef}
                src={imagePreview}
                alt="Image Preview"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            )}
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}