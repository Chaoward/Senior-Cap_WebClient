import {
    Button,
    Toolbar,
    Dialog,
    DialogContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import {
    AddAPhoto,
} from "@mui/icons-material";
import {cache} from "../web-api/data";
import { useState, useRef } from "react";



export default function UploadPreview() {
    const fileInputRef = useRef(null);
    const addFileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
    const [imageGallery, setImageGallery] = useState([]);
    const [selectedLabels, setSelectedLabels] = useState([]);

    const addUploadLabel = (value, index) => {
        // Update the selected labels for the corresponding image
        const updatedLabels = [...selectedLabels];
        updatedLabels[index] = value;
        setSelectedLabels(updatedLabels);
    };


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
            catch (e) {
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


    return (<>
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
                                {cache.labels.map((lab, index) => <MenuItem value={lab}>{lab}</MenuItem>)}
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
    </>);
}