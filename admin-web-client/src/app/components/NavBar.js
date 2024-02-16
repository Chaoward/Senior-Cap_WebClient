"use client";

import { cache, fetchLabels, sendLabels, sendImages, fetchVersion, setRelease } from "../web-api/data.js";
import {
  AppBar,
  Button,
  Toolbar,
  ButtonGroup,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
  List,
  ListItem,
} from "@mui/material";
import {
  BookmarkAdd,
  Add,
  DeleteOutline,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import UploadPreview from "./uploadImagePreview.js";
import AddLabel from "../components/AddLabelsBtn.js";


/**
 * 
 * @param {function} 
 * @returns <AppBar/>
 */
export function VerifyNavBar({onToggle}) {

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
          <AddLabel />
          <UploadPreview />
        </ButtonGroup>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "flex-end",
          }}
        >
          {/* Button to switch pages */}
          <Button
            variant="contained"
            color="primary"
            onClick={onToggle}
            sx={{ ml: 1 }}
          >
            Verison Control
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}


export function VersionNavBar({onToggle}) {

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
          <Button>Filter</Button>
        </ButtonGroup>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "flex-end",
          }}
        >
          {/* Page switch */}
          <Button
            variant="contained"
            color="primary"
            onClick={onToggle}
            sx={{ ml: 1 }}
          >
            Verification
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}
