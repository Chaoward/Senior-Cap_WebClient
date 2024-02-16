import { cache, sendLabels} from "../web-api/data.js";
import {
  Button,
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
import { useState } from "react";





export default function AddLabel() {
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
        cache.labels.indexOf(fieldLabel) >= 0 ||
        newLabels.indexOf(fieldLabel) >= 0
      ) {
        setInvalid(true);
        return;
      }
  
      newLabels.push(fieldLabel);
      setNewLabels([...newLabels]);
      setFieldLabel("");
  
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
                  `${label}${newLabels.indexOf(label) == newLabels.length - 1 ? "" : ", "
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