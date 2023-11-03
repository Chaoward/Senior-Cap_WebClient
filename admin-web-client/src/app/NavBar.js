'use client'

import { cache } from "./data.js";
import {
    AppBar, Button, Toolbar, ButtonGroup, TextField,
    Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, IconButton, List, ListItem,
} from "@mui/material";
import { AddAPhoto, BookmarkAdd, Add, DeleteOutline } from "@mui/icons-material";
import { useState } from "react";


export default function NavBar() {
    return (
        <AppBar position="static" sx={{
            bgcolor: "info.main",
            mt: -1
        }}>
            <Toolbar>
                <ButtonGroup color="inherit" variant="text">
                    <AddLabel />
                    <Button> <AddAPhoto sx={{ mr: 1 }} /> {"Upload Image"}</Button>
                </ButtonGroup>
            </Toolbar>
        </AppBar>

    );
}


//===== Adding Labels ================
export function AddLabel() {
    const [open, setOpen] = useState(false);
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
        if (cache.labels.indexOf(fieldLabel) > 0 || newLabels.indexOf(fieldLabel) > 0) {
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
        console.log(event.target.value);
        setFieldLabel(event.target.value);
    };


    const handleRemove = (label) => {
        delete newLabels[ newLabels.indexOf(label) ];
        setNewLabels([...newLabels]);
    };


    const handleConfirmation = (isAdd) => {
        if (!isAdd) {
            setNewLabels([]);
            setFieldLabel("");
            return setOpen(false);
        }

        // * send new labels to the server *
        newLabels.forEach((value) => cache.labels.push(value));

        //temp
        setNewLabels([]);
        setOpen(false);
    };

    return (
        <>
            <Button onClick={handleClick}> <BookmarkAdd sx={{ mr: 1 }} /> {"Add Label"}</Button>

            <Dialog open={open} onClose={() => setOpen(false)} fullScreen={false}>
                <DialogContent>
                    <DialogTitle align="left" sx={{ flexGrow: 3 }} >Add a New Label</DialogTitle>
                    <List>
                        { newLabels.map((label) => 
                            <ListItem secondaryAction={
                                <IconButton onClick={() => handleRemove(label)}> <DeleteOutline/> </IconButton>
                            }>
                                {label}
                            </ListItem>) 
                        }
                    </List>
                    <form onSubmit={ handleSubmit }>
                        <TextField
                            name="new-label"
                            value={fieldLabel}
                            variant="outlined"
                            label="New Label"
                            onChange={handleChange}
                            helperText={invalid ? "label already exit or queued to get added" : ""}
                        />
                        <IconButton type="submit"> <Add/> </IconButton>
                    </form>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => handleConfirmation(true)}>Confirm</Button>
                    <Button onClick={() => handleConfirmation(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}