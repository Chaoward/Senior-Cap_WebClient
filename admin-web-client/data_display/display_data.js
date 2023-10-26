"use client";

import { useState, useEffect } from "react";
import { cache, sendVerified, fetchPending } from "./data";
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
//   InputLabel,
//   MenuItem,
//   FormControl,
//   Select,
  Button,
  ButtonGroup
} from "@mui/material";
import TagSelection from "./tag-button";
import { Box, Container, Stack, Paper, styled, Card } from "@mui/material";
var retrieve;
var next;

export function FetchButton({ children, onClick }) {
  return <Button onClick={onClick}>{children}</Button>;
}

export function SendVerifiedButton({ children }) {
    const handleClick = () => {
        retrieve();
        sendVerified(() => next());
    };

    return (
        <Button color="success"onClick={handleClick}>
            {children}
        </Button>
    );
}

export default function ImageListData() {
  const [startIndex, setStartIndex] = useState(0);
  const [imageListData, setImageListData] = useState([]);
  const [imagesPerPage, setImagesPerPage] = useState(2);

  const verifiedCount = Math.max(0, startIndex - imagesPerPage);
  const pendingCount = Math.max(0, cache.length - startIndex);

  const _retrieve = () => {
    fetchPending(() => {
      _next();
      
    });
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
    const newStartIndex = Math.min((startIndex + imagesPerPage),cache.length);
      if (newStartIndex !== startIndex) {
      const endIndex = Math.min(newStartIndex + imagesPerPage, cache.length); // Calculate endIndex based on newStartIndex
      setStartIndex(newStartIndex); // Update startIndex first
      const temp = cache.slice(newStartIndex, endIndex);
      setImageListData(temp);
    }
  };

  //this one starts with the first index of the images but twice click for traverse
  const _next2 = () => {
    const endIndex = Math.min(startIndex + imagesPerPage, cache.length); // Ensure endIndex is within the bounds of cache.length
    const temp = cache.slice(startIndex, endIndex);
    setImageListData(temp);
    setStartIndex(endIndex); // Update startIndex to the actual endIndex or cache.length
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

  return (
    <Container>
      <Box alignContent="center" sx={{ border:"dash"}}>
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
            <FetchButton onClick={_retrieve}>Fetch Data</FetchButton>
            <Button onClick={_previous} disabled={startIndex === 0}>Back</Button>
            <Button
              onClick={_next}
              disabled={startIndex + imagesPerPage >= cache.length}
            >
              Next
            </Button>
            <SendVerifiedButton >Send Verified</SendVerifiedButton>
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
