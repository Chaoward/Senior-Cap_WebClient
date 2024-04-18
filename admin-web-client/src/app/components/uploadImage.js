import React, { useState, useRef } from "react";
import {
  Button,
  Toolbar,
  Dialog,
  DialogContent,
  Typography,
  TextField,
  IconButton,
  DialogTitle,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { AddAPhoto, Add } from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";
import { cache, uploadImages } from "../web-api/api";
import LabelDropdown from "./LabelDropdown";

export default function UploadPreview() {
  const [images, setImages] = useState([]);
  const [labels, setLabels] = useState([]);
  const [userLabels, setUserLabels] = useState([]);
  const [open, setOpen] = useState(false);
  const fileRef = useRef(null);
  const [isPlusButtonEnabled, setIsPlusButtonEnabled] = useState(false);
  const [confirmUploadOpen, setConfirmUploadOpen] = useState(false);

  const handleUpload = () => {
    if (!images) {
      console.error("No Images Loaded");
      return;
    }

    setOpen(true);
  };

  const handleClosing = () => {
    setImages([]);
    setLabels([]);
    setUserLabels([]);
    setOpen(false);
  };

  const handleLoadImage = (e) => {
    const newImages = [];
    const newLabels = [];
    const newUserLabels = [];

    for (let i = 0; i < e.target.files.length; i++) {
      newImages.push(e.target.files[i]);
      newLabels.push("");
      newUserLabels.push("");
    }

    setImages(newImages);
    setLabels(newLabels);
    setUserLabels(newUserLabels);
    setOpen(true);
  };

  const handleAutocompleteInputChange = (event, value, index) => {
    const newUserLabels = [...userLabels];
    newUserLabels[index] = value;
    setUserLabels(newUserLabels);

    setIsPlusButtonEnabled(
      value.trim() !== "" && !cache.labels.includes(value.trim())
    );
  };

  const handlePlusButtonClick = (index) => {
    const userInput = userLabels[index].trim();
    if (userInput !== "" && !cache.labels.includes(userInput)) {
      cache.labels.push(userInput);
      setLabels([...labels, userInput]);
      const newUserLabels = [...userLabels];
      newUserLabels[index] = "";
      setUserLabels(newUserLabels);
    }
  };

  const handleConfirmUpload = () => {
    const imgList = images.map((image, index) => ({
      file: image,
      label: labels[index],
      userLabel: userLabels[index],
    }));

    uploadImages(imgList).then((res) => {
      if (res.success) {
        console.log(`Successful Uploads : ${res.count}`);
      } else {
        console.error(res.error);
      }

      setImages([]);
      setLabels([]);
      setUserLabels([]);
      setConfirmUploadOpen(false);
    });
  };

  return (
    <>
      <Button color="secondary" onClick={() => fileRef.current.click()}>
        {" "}
        <AddAPhoto sx={{ mr: 1, color: "#1d1128" }} /> {"Upload Image"}
      </Button>
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileRef}
        onChange={handleLoadImage}
        multiple
      />

      <Dialog open={open} onClose={handleClosing} maxWidth="md">
        <DialogContent
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          <Toolbar
            sx={{ gridColumn: "span 3", justifyContent: "space-between" }}
          >
            <Typography variant="h6" gutterBottom>
              Upload Image
            </Typography>
            <Button
              variant="contained"
              color="inherit"
              onClick={() => fileRef.current.click()}
            >
              Add
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleUpload}
            >
              Upload
            </Button>
          </Toolbar>
          {images.map((image, index) => (
            <div
              key={index}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <img
                src={URL.createObjectURL(image)}
                alt={`Image Preview ${index + 1}`}
                style={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                  marginBottom: "8px",
                }}
              />
              <LabelDropdown
                labels={cache.labels}
                value={labels[index]}
                onChange={(e) =>
                  setLabels((prevLabels) => {
                    const newLabels = [...prevLabels];
                    newLabels[index] = e.target.value;
                    return newLabels;
                  })
                }
              />
              <div style={{ display: "flex", alignItems: "center" }}>
                <Autocomplete
                  value={userLabels[index]}
                  inputValue={userLabels[index]}
                  onInputChange={(event, value) =>
                    handleAutocompleteInputChange(event, value, index)
                  }
                  options={cache.labels}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="User Label"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
                <IconButton
                  color="primary"
                  aria-label="add"
                  onClick={() => handlePlusButtonClick(index)}
                  disabled={!isPlusButtonEnabled}
                >
                  <Add />
                </IconButton>
              </div>
            </div>
          ))}

          <Dialog
            open={confirmUploadOpen}
            onClose={() => setConfirmUploadOpen(false)}
          >
            <DialogTitle>Confirm Upload</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to upload these images?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleConfirmUpload}>Yes</Button>
              <Button onClick={() => setConfirmUploadOpen(false)}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </DialogContent>
      </Dialog>
    </>
  );
}
