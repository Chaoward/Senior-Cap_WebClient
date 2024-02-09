"use client";

import { cache, fetchLabels, sendLabels, sendImages, fetchVersion, setRelease } from "./data.js";
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
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  AddAPhoto,
  BookmarkAdd,
  Add,
  DeleteOutline,
} from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import Chip from "@mui/material/Chip";
import * as server from "./server-endpoints";
import { fetchPending } from "./data";

export default function NavBar() {
  const fileInputRef = useRef(null);
  const addFileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [imageGallery, setImageGallery] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [modelVersions, setModelVersions] = useState([]);
  const [releaseVersion, setReleaseVersion] = useState("");

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleAddButtonClick = () => {
    addFileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const selectedFiles = event.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      const galleryImages = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const reader = new FileReader();

        reader.onload = (e) => {
          galleryImages.push(e.target.result);

          if (i === selectedFiles.length - 1) {
            setImagePreview(galleryImages[galleryImages.length - 1]);
            setImageGallery([...imageGallery, ...galleryImages]);
            setOpenPreviewDialog(true);
          }
        };

        reader.readAsDataURL(selectedFiles[i]);
      }
    }
  };

  const handleAddFileChange = async (event) => {
    const selectedFiles = event.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      const galleryImages = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const reader = new FileReader();

        reader.onload = (e) => {
          galleryImages.push(e.target.result);

          if (i === selectedFiles.length - 1) {
            setImageGallery([...imageGallery, ...galleryImages]);
          }
        };

        reader.readAsDataURL(selectedFiles[i]);
      }
    }
  };

  const handleClosePreviewDialog = () => {
    setOpenPreviewDialog(false);
    setImagePreview(null);
  };

  const addUploadLabel = (value, index) => {
    // Update the selected labels for the corresponding image
    const updatedLabels = [...selectedLabels];
    updatedLabels[index] = value;
    setSelectedLabels(updatedLabels);
  };

  useEffect(() => {
    // Fetch model versions from the server
    fetchVersion((list) => {
        setModelVersions(list);
    });
  }, []);

  /*
  const fetchModelVersions = async () => {
    try {
      const response = await fetch("/api/model-versions");
      if (response.ok) {
        const data = await response.json();
        setModelVersions(data);
      } else {
        console.error("Failed to fetch model versions:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching model versions:", error);
    }
  };
  */

  const handleReleaseVersionChange = (event) => {
    setReleaseVersion(event.target.value);
  };

  const handleSetReleaseVersion = async () => {
    setRelease(releaseVersion, () => {
        setModelVersions(cache.versions);
    });
  };


  const handleUpload = async () => {
    const imgLabList = [];
    //combine image and label
    for (let i = 0; i < imageGallery.length; i++) {
        try {
            imgLabList.push({
                image: imageGallery[i],
                label: selectedLabels[i]
            });
        }
        catch (e){
            imgLabList.push({
                image: imageGallery[i],
                label: ""
            });
        }
    }
    await sendImages(imgLabList);
    //clear gallery
    setImageGallery([]);
    setSelectedLabels([]);
    setOpenPreviewDialog(false);
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
          <AddLabel setImagePreview={setImagePreview} />
          <Button color="secondary" onClick={handleButtonClick}>
            {" "}
            <AddAPhoto sx={{ mr: 1, color: "#1d1128" }} /> {"Upload Image"}
          </Button>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
          />
        </ButtonGroup>

        {/* Preview Dialog */}
        <Dialog
          open={openPreviewDialog}
          onClose={handleClosePreviewDialog}
          maxWidth="md"
        >
          <DialogContent
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
            }}
          >
            <Toolbar
              sx={{ gridColumn: "span 4", justifyContent: "space-between" }}
            >
              <Typography variant="h6" gutterBottom>
                Upload Image
              </Typography>
              <Button
                variant="contained"
                color="inherit"
                onClick={handleAddButtonClick}
              >
                Add
              </Button>
              <Button variant="contained" color="secondary" onClick={handleUpload}>
                Upload
              </Button>
            </Toolbar>
            {imageGallery.map((image, index) => (
              <div
                key={index}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <img
                  src={image}
                  alt={`Image Preview ${index + 1}`}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "auto",
                    marginBottom: "8px",
                  }}
                />
                <FormControl
                  fullWidth
                  variant="outlined"
                  style={{ marginBottom: "8px" }}
                >
                  <InputLabel>Add new label</InputLabel>
                  <Select
                    label="Add new label"
                    onChange={(e) => addUploadLabel(e.target.value, index)} // You need to define the function addUploadLabel
                  >
                    {cache.labels.map((lab, index) => <MenuItem value={lab}>{lab}</MenuItem> )}
                  </Select>
                </FormControl>
              </div>
            ))}

            {/* file input for adding more images */}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={addFileInputRef}
              onChange={handleAddFileChange}
              multiple
            />
          </DialogContent>
        </Dialog>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "flex-end",
          }}
        >
          {/* Menu to select release version */}
          <FormControl sx={{ width: "160px" }}>
            <InputLabel id="release-version-label" sx={{ width: "auto" }}>
              Release Version
            </InputLabel>
            <Select
              labelId="release-version-label"
              value={releaseVersion}
              onChange={handleReleaseVersionChange}
              renderValue={(selected) => selected || "Select Release Version"}
            >
              {/*<MenuItem value="1.1.0">Version 1.1.0</MenuItem>
              <MenuItem value="1.2.1">Version 1.2.1</MenuItem>*/}
              {modelVersions.map((version) => (
                <MenuItem key={version} value={version}>
                  {version} {cache.versions["release"] === version ? " (Release)" : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Button to set release version */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSetReleaseVersion}
            sx={{ ml: 1 }}
          >
            Set Release Version
          </Button>
        </div>
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

    reader.onload = (e) => {
      const imagePreview = document.getElementById("image-preview");
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";

      // Open the modal
      openModal();
    };
  };

  return (
    <>
      <Button color="secondary" onClick={handleClick}>
        {" "}
        <BookmarkAdd sx={{ mr: 1, color: "#1d1128" }} /> {"Add Label"}
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
