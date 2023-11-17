'use client'
import * as server from './server-endpoints';
import Chip from "@mui/material/Chip";
import { AddAPhoto } from "@mui/icons-material";
import { sendImage, cache } from "./data.js";
import {Button, Dialog, DialogContent, Autocomplete, DialogActions, Input, TextField} from "@mui/material";
import { useRef, useState } from 'react';





export function UploadButton() {
    const fileInputRef = useRef(null);
    const [imgFile, setImgFile] = useState({});
    const [label, setLabel] = useState("");
    const [confidence, setConfidence] = useState(0);
    const [open, setOpen] = useState(false);

    const handleButtonClick = () => {
        // trigger the file input when the button is clicked
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];

        console.log(selectedFile);
        if (!selectedFile) return console.log("No File Selected");

        //display preview
        setImgFile(selectedFile);
        setOpen(true);

        /*
        sendImage(selectedFile, "cat", "2", (res) => {
            if (res.ok)
                console.log("Upload callback Success?");
        });
        */
    };

    const handleSend = () => {
        sendImage(imgFile, label, confidence, (res) => {
            if (res.ok)
                console.log("Upload callback Success?");
            setOpen(false);
        });
    };


    const handleChange = (e, val) => {
        e.preventDefault();
        if (val === label) return;
        setLabel(val);
        console.log(val);
    };

    return (
        <>
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

            {/* Preview Image and setting Label */}
            <Dialog
                open={open}
                onClose={() => {setOpen(false)}}
            >
                <DialogContent>
                    <img width={250} height={250} src={imgFile.name} />
                    <br/>
                    <Autocomplete
                        value={label}
                        onChange={handleChange}
                        id="tag_selection"
                        options={ cache.labels }
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Label" />}
                    />
                    <br/>
                    <Input type='number' onChange={(e, val) => setConfidence(val)}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSend}> {"Upload"} </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}