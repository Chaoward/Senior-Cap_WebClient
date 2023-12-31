"use client";
import * as React from 'react';
import { useState, useEffect } from "react";
import { cache, sendVerified, fetchPending } from "./data";
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import TagSelection from "./tag-button";
import { Box, Container, Stack, Paper, styled } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


//===== FetchButton =======================================
export function FetchButton({ children, callback }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    //if data on cache.unverified, prompt user wether to refetch
    if (cache.unverified.length > 0) setOpen(true);
    else handleConfirm();
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
            {
              "Already fetched a batch of unverified data, fetching again will REMOVE any changes to the curent batch.\n\nDo want to proceed?"
            }
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
  };

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
            {
              "Confirm that all images are verified and ready for model training?"
            }
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
  const [imageListData, setImageListData] = useState(cache.unverified);
  const [imagesPerPage, setImagesPerPage] = useState(2);

  const verifiedCount = Math.max(0, startIndex - imagesPerPage);
  const pendingCount = Math.max(0, cache.unverified.length - startIndex);

  //callback after fetching
  const _retrieve = () => {
    //after fetch, set start index and display first set of images
    setStartIndex(0);
    const firstImages = cache.unverified.slice(startIndex, imagesPerPage);
    setImageListData(firstImages);
  };

  const _previous = () => {
    const newStartIndex = Math.max(0, startIndex - imagesPerPage);
    const endIndex = Math.min(
      newStartIndex + imagesPerPage,
      cache.unverified.length
    ); // Calculate endIndex based on newStartIndex or total available images
    const temp = cache.unverified.slice(newStartIndex, endIndex);
    setImageListData(temp);
    setStartIndex(newStartIndex); // Update startIndex
  };

  //This one starts with second index but traverse once
  const _next = () => {
    const newStartIndex = Math.min(
      startIndex + imagesPerPage,
      cache.unverified.length
    );
    if (newStartIndex !== startIndex) {
      const endIndex = Math.min(
        newStartIndex + imagesPerPage,
        cache.unverified.length
      ); // Calculate endIndex based on newStartIndex
      setStartIndex(newStartIndex); // Update startIndex first
      const temp = cache.unverified.slice(newStartIndex, endIndex);
      setImageListData(temp);
    }
  };

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

  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };


  return (
    <Container>
      <Box alignContent="center" sx={{ border: "dash" }}>
        <Stack spacing={2} alignItems={"center"}>
          
          <FormControl color='warning' sx={{ m: 1, minWidth: 180 }} size="small">
            <InputLabel id="demo-select-small-label">images per page</InputLabel>
            <Select
              value={imagesPerPage}
              label="images per page "
              onChange={handleImagesPerPageChange}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>8</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={10}>10</MenuItem>

            </Select>
          </FormControl>

          <FormControl>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
              <FetchButton color="primary" callback={_retrieve}>
                Fetch Data
              </FetchButton>
              <Button
                color="secondary"
                onClick={_previous}
                disabled={startIndex === 0}
              >
                Back
              </Button>
              <Button
                color="secondary"
                onClick={_next}
                disabled={startIndex + imagesPerPage >= cache.unverified.length}
              >
                Next
              </Button>
              <SendVerifiedButton
                callback={() => setImageListData(cache.unverified)}
              >
                Send Verified
              </SendVerifiedButton>
            </ButtonGroup>
          </FormControl>

          <Item>
            Pending: {pendingCount} | Verified:{" "}
            {verifiedCount < 0 ? 0 : verifiedCount}
          </Item>
        </Stack>

        <Item sx={{margin: 5}}>
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
