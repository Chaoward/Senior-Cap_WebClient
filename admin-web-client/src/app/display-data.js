"use client";

import { useState, useEffect } from "react";
import { cache, sendVerified, fetchPending } from "./data";
import {
  ImageList, ImageListItem, ImageListItemBar,
  //   InputLabel,
  //   MenuItem,
  //   FormControl,
  //   Select,
  Button,
  ButtonGroup,
  Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText
} from "@mui/material";
import TagSelection from "./tag-button";
import { Box, Container, Stack, Paper, styled, Card } from "@mui/material";
//var retrieve;
//var next;


//===== FetchButton =======================================
export function FetchButton({ children, callback }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    //if data on cache, prompt user wether to refetch
    if (cache.length > 0)
      setOpen(true);
    else
      handleConfirm();
  };

  //fetch
  const handleConfirm = async () => {
    await fetchPending(callback);
    setOpen(false);
  };

  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleClick}>{children}</Button>

      <Dialog
        id="fetch-prompt"
        fullScreen={false}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{"Refetch Unverified Data?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {"Already fetched a batch of unverified data, fetching again will REMOVE any changes to the curent batch.\n\nDo want to proceed?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm}>Confirm</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
//===== *END* FetchButton *END* =======================================



//===== SendVerifiedButton =======================================
export function SendVerifiedButton({ children, callback }) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    await sendVerified(() => callback());
    setOpen(false);
  }

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <div>
      <Button color="success" onClick={handleClick}>
        {children}
      </Button>

      <Dialog
        id="send-prompt"
        fullScreen={false}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{"Send Verified Images?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {"Confirm that all images are verified and ready for model training?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm}>Confirm</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
//===== *END* SendVerifiedButton *END* =======================================


//===== ImageListData =======================================================
export default function ImageListData() {
  const [startIndex, setStartIndex] = useState(0);
  const [imageListData, setImageListData] = useState([]);
  const [imagesPerPage, setImagesPerPage] = useState(2);

  const verifiedCount = Math.max(0, startIndex - imagesPerPage);
  const pendingCount = Math.max(0, cache.length - startIndex);

  //callback after fetching
  const _retrieve = () => {
    //after fetch, set start index and display first set of images
    setStartIndex(0);
    const firstImages = cache.slice(startIndex, imagesPerPage);
    setImageListData(firstImages);
  };

  const _previous = () => {
    const newStartIndex = Math.max(0, startIndex - imagesPerPage);
    const endIndex = Math.min(newStartIndex + imagesPerPage, cache.length); // Calculate endIndex based on newStartIndex or total available images
    const temp = cache.slice(newStartIndex, endIndex);
    setImageListData(temp);
    setStartIndex(newStartIndex); // Update startIndex
  };

  //This one starts with second index but traverse once
  const _next = () => {
    const newStartIndex = Math.min((startIndex + imagesPerPage), cache.length);
    if (newStartIndex !== startIndex) {
      const endIndex = Math.min(newStartIndex + imagesPerPage, cache.length); // Calculate endIndex based on newStartIndex
      setStartIndex(newStartIndex); // Update startIndex first
      const temp = cache.slice(newStartIndex, endIndex);
      setImageListData(temp);
    }
  };

  //this one starts with the first index of the images but twice click for traverse
  /*
  const _next2 = () => {
    const endIndex = Math.min(startIndex + imagesPerPage, cache.length); // Ensure endIndex is within the bounds of cache.length
    const temp = cache.slice(startIndex, endIndex);
    setImageListData(temp);
    setStartIndex(endIndex); // Update startIndex to the actual endIndex or cache.length
  };
  */

  const handleImagesPerPageChange = (event) => {
    const newImagesPerPage = parseInt(event.target.value, 10);
    setImagesPerPage(newImagesPerPage);
    setStartIndex(0);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
  }));

  return (
    <Container>
      <Box alignContent="center" sx={{ border: "dash" }}>
        <Stack spacing={2} alignItems={"center"}>

          <Item>
            Display{" "}
            <input
              type="number"
              min="1"
              value={imagesPerPage}
              onChange={handleImagesPerPageChange}
            />{" "}
            images per page
          </Item>

          <Item>
            <ButtonGroup variant="outlined" aria-label="outlined button group" color="secondary">
              <FetchButton callback={_retrieve}>Fetch Data</FetchButton>
              <Button onClick={_previous} disabled={startIndex === 0}>Back</Button>
              <Button
                onClick={_next}
                disabled={startIndex + imagesPerPage >= cache.length}
              >
                Next
              </Button>
              <SendVerifiedButton callback={() => setImageListData(cache)}>Send Verified</SendVerifiedButton>
            </ButtonGroup>
          </Item>

          <Item>
            Pending: {pendingCount} | Verified:{" "}
            {verifiedCount < 0 ? 0 : verifiedCount}
          </Item>
        </Stack>

        <Item>
          <ImageList>
            {imageListData.map((entry) => (
              <ImageListItem key={entry.id}>
                <ImageListItemBar
                  title={<TagSelection entry={entry} />}
                  position="below"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Item>
      </Box>
    </Container>
  );
}
//===== *END* ImageListData *END* =======================================================
