"use client";

import { cache, fetchLabels, sendLabels } from "./data.js";
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
  AddAPhoto,
  BookmarkAdd,
  Add,
  DeleteOutline,
} from "@mui/icons-material";
import { useState, useRef } from "react";
import Chip from "@mui/material/Chip";
import * as server from './server-endpoints';
import { fetchPending } from './data'; // Import the fetchPending function

export default function NavBar() {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    // trigger the file input when the button is clicked
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {

            // Upload the selected file to the server
            const formData = new FormData();
            formData.append('image', selectedFile);
      
            try {
              const response = await fetch(server.POST_uploadImage, {
                method: 'POST',
                body: formData,
              });
      
              if (response.ok) {
                // If the upload is successful, fetch the updated list of unverified images
                await fetchPending((resJson) => {
                  console.log('Updated list of unverified images:', resJson);
                });
              } else {
                console.error('Image upload failed');
              }
            } catch (error) {
              console.error('Error uploading image:', error);
            }
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "#477b82",
        mt: -1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <ButtonGroup color="inherit" variant="text">
          <AddLabel />
          <Button onClick={handleButtonClick}>
            {" "}
            <AddAPhoto sx={{ mr: 1 }} /> {"Upload Image"}
          </Button>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </ButtonGroup>

        <Chip label="Model Version: 1.0" color="primary" />
      </Toolbar>
    </AppBar>
  );
}

//===== Adding Labels ================
export function AddLabel() {
  const [open, setOpen] = useState(false);
  const [openConfirm, SetOpenConfirm] = useState(false);
  const [newLabels, setNewLabels] = useState([]);
  const [fieldLabel, setFieldLabel] = useState("");
  const [invalid, setInvalid] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    //check if new label exist
    if (fieldLabel == "") return;
    if (
      cache.labels.indexOf(fieldLabel) > 0 ||
      newLabels.indexOf(fieldLabel) > 0
    ) {
      setInvalid(true);
      return;
    }

    setFieldLabel("");
    newLabels.push(fieldLabel);
    setNewLabels([...newLabels]);

    setInvalid(false);
  };

  const handleChange = (event) => {
    event.preventDefault();
    //console.log(event.target.value);
    setFieldLabel(event.target.value);
  };

  const handleRemove = (label) => {
    newLabels[newLabels.indexOf(label)] = newLabels[newLabels.length - 1];
    newLabels.pop();
    setNewLabels([...newLabels]);
  };

  const handleConfirmation = (isAdd) => {
    if (!isAdd) {
      setNewLabels([]);
      setFieldLabel("");
      return setOpen(false);
    }

    SetOpenConfirm(true);
  };

  const handleConfirmSend = (isAdd) => {
    if (!isAdd) {
      return SetOpenConfirm(false);
    }

    // * send new labels to the server *

    sendLabels(newLabels, (resJson) => {
      //newLabels.forEach((value) => cache.labels.push(value));
      setNewLabels([]);
      setOpen(false);
      SetOpenConfirm(false);

      //replace alert with notification
      //alert( cache.labels );
    });
  };

  return (
    <>
      <Button onClick={handleClick}>
        {" "}
        <BookmarkAdd sx={{ mr: 1 }} /> {"Add Label"}
      </Button>
      {/*===== Main Adding Labels Screen =====================*/}
      <Dialog open={open} onClose={() => setOpen(false)} fullScreen={false}>
        <DialogContent>
          <DialogTitle align="left" sx={{ flexGrow: 3 }}>
            Add a New Label
          </DialogTitle>
          <List>
            {newLabels.map((label) => (
              <ListItem
                secondaryAction={
                  <IconButton onClick={() => handleRemove(label)}>
                    {" "}
                    <DeleteOutline />{" "}
                  </IconButton>
                }
              >
                {label}
              </ListItem>
            ))}
          </List>
          <form onSubmit={handleSubmit}>
            <TextField
              name="new-label"
              value={fieldLabel}
              variant="outlined"
              label="New Label"
              onChange={handleChange}
              helperText={
                invalid ? "label already exit or queued to get added" : ""
              }
              error={invalid}
            />
            <IconButton type="submit">
              {" "}
              <Add />{" "}
            </IconButton>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => handleConfirmation(true)}>Confirm</Button>
          <Button onClick={() => handleConfirmation(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/*===== Confirmation Screen =====================*/}
      <Dialog
        open={openConfirm}
        onClose={() => SetOpenConfirm(false)}
        fullScreen={false}
      >
        <DialogTitle>Confirm Adding New Labels?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {newLabels.map(
              (label) =>
                `${label}${
                  newLabels.indexOf(label) == newLabels.length - 1 ? "" : ", "
                }`
            )}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => handleConfirmSend(true)}>
            Confirm & Send
          </Button>
          <Button onClick={() => handleConfirmSend(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
