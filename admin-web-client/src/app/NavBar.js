'use client'

import { cache, fetchLabels, sendLabels } from "./data.js";
import {
    AppBar, Button, Toolbar, ButtonGroup, TextField,
    Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, IconButton, List, ListItem,
} from "@mui/material";
import { AddAPhoto, BookmarkAdd, Add, DeleteOutline, BugReport } from "@mui/icons-material";
import { useState } from "react";
import * as data from "./data.js";


export default function NavBar() {
    const handleDebug = () => {
        
        data.sendLabels(["t1", "t"], (resJson) => {
            //alert(resJson);
            console.log(resJson);
        });
    };

    const handleDebug2 = () => {
        data.fetchLabels((resJson) => {
            console.log(resJson);
            console.log( cache.labels.map((tag) => Object({label: tag, value: tag})) );
        });
    };

    return (
        <AppBar position="static" sx={{
            bgcolor: "info.main",
            mt: -1
        }}>
            <Toolbar>
                <ButtonGroup color="inherit" variant="text">
                    <AddLabel/>
                    <Button> <AddAPhoto sx={{ mr: 1 }} /> {"Upload Image"}</Button>
                    <Button onClick={handleDebug}> <BugReport/> {"Send Test"} </Button>
                    <Button onClick={handleDebug2}> <BugReport/> {"Fetch Test"} </Button>
                </ButtonGroup>
            </Toolbar>
        </AppBar>

    );
}


//===== Adding Labels ================
export function AddLabel() {
    const [open, setOpen] = useState(false);
    const [openConfirm, SetOpenConfirm] = useState(false);
    const [openDenied, setOpenDenied] = useState(false);
    const [newLabels, setNewLabels] = useState([]);
    const [denied, setDenied] = useState([]);
    const [fieldLabel, setFieldLabel] = useState("");
    const [invalid, setInvalid] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        //check if new label exist
        if (fieldLabel == "") return;
        if (cache.labels.indexOf(fieldLabel) >= 0 || newLabels.indexOf(fieldLabel) >= 0) {
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
        newLabels[ newLabels.indexOf(label) ] = newLabels[newLabels.length-1];
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
            if (resJson.denied.length > 0) {
                //display denied dialog
                setDenied( resJson );
                setOpenDenied(true);
            }

            setNewLabels([]);
            setOpen(false);
            SetOpenConfirm(false);

            //replace alert with notification
            //alert( cache.labels );
        });
        
    };

    return (
        <>
            <Button onClick={handleClick}> <BookmarkAdd sx={{ mr: 1 }} /> {"Add Label"}</Button>
            {/*===== Main Adding Labels Screen =====================*/}
            <Dialog open={open} onClose={() => setOpen(false)} fullScreen={false}>
                <DialogContent>
                    <DialogTitle align="left" sx={{ flexGrow: 3 }} >Add a New Label</DialogTitle>
                    <List>
                        { newLabels.map((label) => 
                            <ListItem secondaryAction={
                                <IconButton sx={{fontSize: 16}} onClick={() => handleRemove(label)}> ❌ </IconButton>
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
                            error={invalid}
                        />
                        <IconButton type="submit"> <Add/> </IconButton>
                    </form>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => handleConfirmation(true)}>Confirm</Button>
                    <Button onClick={() => handleConfirmation(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>

            {/*===== Confirmation Screen =====================*/}
            <Dialog open={openConfirm} onClose={() => SetOpenConfirm(false)} fullScreen={false}>
                <DialogTitle>Confirm Adding New Labels?</DialogTitle>
                <DialogContent>
                    <DialogContentText> 
                        {newLabels.map(label => `${label}${newLabels.indexOf(label) == newLabels.length-1 ? "" : ", "}` )} 
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => handleConfirmSend(true)}>Confirm & Send</Button>
                    <Button onClick={() => handleConfirmSend(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>

            {/*===== Denied List Screen =====================*/}
            <Dialog>
                <DialogTitle open={openDenied} onClose={() => setOpenDenied(true)} sx={{color: "red"}}>{denied.length} Labels were Denied</DialogTitle>
                <DialogContent> {denied.join(", ")} </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDenied(false)}>OK</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}