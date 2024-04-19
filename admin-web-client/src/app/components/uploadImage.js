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
import {cache, uploadImages} from "../web-api/api";
import { useState, useRef } from "react";
import LabelSelection from "./LabelSelection";



export default function UploadPreview() {
  const [images, setImages] = useState([]);
  const [labels, setLabels] = useState([]); //labels: {syslabel: string, userLabel: string}
  const [open, setOpen] = useState(false);
  const fileRef = useRef(null);

  const handleUpload = () => {
      if (!images) {
          return console.error('No Images Loaded');
      }

      //pair images with labels
      console.log(images);
      const imgList = [];
      for (let i = 0; i < images.length; i++) {
          imgList.push({
              file: images[i],
              sysLabel: labels[i].sysLabel,
              userLabel: labels[i].userLabel
          });
      }
      console.log(imgList);

      //upload
      uploadImages(imgList).then(res => {
          res.success ? console.log(`Successful Uploads : ${res.count}`) :
                        console.error(res.error);
          
          setOpen(false);
          setImages([]);
          setLabels([]);
      });
  };

  const handleClosing = () => {
      setImages([]);
      setLabels([]);
      setOpen(false);
  };

  const handleLoadImage = (e) => {
      for (let i = 0; i < e.target.files.length; i++)
          images.push(e.target.files[i]);
      setImages([...images]);
      setOpen(true);
      for (let i = 0; i < e.target.files.length; i++)
          labels.push({
            sysLabel: "",
            userLabel: ""
          });
      setLabels([...labels]);
  };



  return (<>
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

      {/* Preview Dialog */}
      <Dialog
          open={open}
          onClose={handleClosing}
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
                      onClick={() => fileRef.current.click()}
                  >
                      Add
                  </Button>
                  <Button variant="contained" color="secondary" onClick={handleUpload}>
                      Upload
                  </Button>
              </Toolbar>
              {images.map((image, index) => (
                  <div
                      key={index}
                      style={{ display: "flex", flexDirection: "column" }}
                  >
                      <img
                          src={ URL.createObjectURL(image) }
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
                          <LabelSelection
                            userLabel={labels[index].userLabel}
                            sysLabel={labels[index].sysLabel}
                            onSysChange={(e, val) => {
                              e.preventDefault();
                              labels[index].sysLabel = val;
                              setLabels([...labels]);
                            }}
                            onUserChange={(e) => {
                              e.preventDefault();
                              labels[index].userLabel = e.target.value;
                              setLabels([...labels]);
                            }}
                            sx={ {width: 150} }
                          />

                          {/*
                          <Select
                              label="Add new label"
                              onChange={(e) => labels[index] = e.target.value}
                          >
                              {cache.labels.map((lab, index) => <MenuItem value={lab}>{lab}</MenuItem>)}
                          </Select>
                          */}
                      </FormControl>
                  </div>
              ))}
          </DialogContent>
      </Dialog>
  </>);
}