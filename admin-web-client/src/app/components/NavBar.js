"use client";
import React, { useState } from "react";
import { AppBar, Button, Toolbar, ButtonGroup } from "@mui/material";
import UploadPreview from "../components/uploadImage.js";
import AddLabel from "../components/AddLabelsBtn.js";
import TrainModelBtn from "../components/TrainModelBtn.js"; // Import the TrainModelBtn component here

export function VerifyNavBar({ onViewVersionControl, onToggle }) {
  const [isToggled, setIsToggled] = useState(false);

  const handleClick = () => {
    setIsToggled(!isToggled); // Toggle the state
    onToggle(!isToggled); // Call the onToggle function with the updated state
  };
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "#E5D4ED",
        mt: -1,
      }}
    >
      <Toolbar>
        <ButtonGroup color="inherit" variant="text">
          <UploadPreview />
          <TrainModelBtn />
        </ButtonGroup>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleClick}
            sx={{ ml: 1 }}
          >
            {isToggled ? "Version Control" : "Verification"}
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export function VersionNavBar({ onToggle }) {
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "#E5D4ED",
        mt: -1,
      }}
    >
      <Toolbar>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "flex-end",
          }}
        ></div>
      </Toolbar>
    </AppBar>
  );
}
