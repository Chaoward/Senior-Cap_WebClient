'use client'
import * as server from './server-endpoints';
import Chip from "@mui/material/Chip";
import { AddAPhoto } from "@mui/icons-material";
import { fetchPending } from "./data.js";
import {Button} from "@mui/material";
import { useRef } from 'react';





export function UploadButton() {
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
        </>
    );
}