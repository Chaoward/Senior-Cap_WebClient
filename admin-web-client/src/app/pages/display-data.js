"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { cache, verify, fetchUnverified, fetchLabels } from "../web-api/api";
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
import TagSelection from "../components/tag-button";
import { Box, Container, Stack, Paper, styled } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";

//===== FetchButton =======================================
export function FetchButton({ children, callback }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (cache.unverified.length > 0) setOpen(true);
    else handleConfirm();
  };

  const handleConfirm = () => {
    fetchUnverified().then((r) => {
      if (cache.labels.length === 0) {
        fetchLabels().then((r) => {
          setOpen(false);
          callback();
        });
      } else {
        setOpen(false);
        callback();
      }
    });
  };

  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button color="info" onClick={handleClick}>
        {children}
      </Button>

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
              "Already fetched a batch of unverified data, fetching again will REMOVE any changes to the current batch.\n\nDo you want to proceed?"
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="success" onClick={handleConfirm}>
            Confirm
          </Button>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
//===== *END* FetchButton *END* =======================================

//===== SendVerifiedButton =======================================
export function SendVerifiedButton({ children, callback }) {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const handleConfirm = async () => {
    verify(cache.unverified).then((r) => {
      callback();
      setOpen(false);
    });
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
            {"Confirm that all images are verified and ready for model training?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="success" onClick={handleConfirm}>
            Confirm
          </Button>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
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
  const pendingCount = Math.max(0, imageListData.length - startIndex);

  const _retrieve = () => {
    setStartIndex(0);
    const firstImages = cache.unverified.slice(startIndex, imagesPerPage);
    setImageListData(firstImages);
  };

  const _previous = () => {
    const newStartIndex = Math.max(0, startIndex - imagesPerPage);
    const endIndex = Math.min(
      newStartIndex + imagesPerPage,
      cache.unverified.length
    );
    const temp = cache.unverified.slice(newStartIndex, endIndex);
    setImageListData(temp);
    setStartIndex(newStartIndex);
  };

  const _next = () => {
    const newStartIndex = Math.min(
      startIndex + imagesPerPage,
      cache.unverified.length
    );
    if (newStartIndex !== startIndex) {
      const endIndex = Math.min(
        newStartIndex + imagesPerPage,
        cache.unverified.length
      );
      setStartIndex(newStartIndex);
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

  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Container>
      <Box alignContent="center" sx={{ border: "dash" }}>
        <Stack spacing={2} alignItems={"center"}>
          <FormControl
            sx={{ m: 1, minWidth: 180, color: "#514F59" }}
            size="small"
          >
            <InputLabel sx={{ color: "#514F59" }} id="demo-select-small-label">
              Images per page
            </InputLabel>
            <Select
              sx={{ color: "#514F59" }}
              value={imagesPerPage}
              label="Images per page"
              onChange={handleImagesPerPageChange}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <ButtonGroup variant="contained" disableElevation>
              <FetchButton callback={_retrieve}>Fetch Data</FetchButton>

              <IconButton onClick={_previous} disabled={startIndex === 0}>
                <WestIcon sx={{ color: "#000000" }} />
              </IconButton>

              <IconButton
                onClick={_next}
                disabled={startIndex + imagesPerPage >= cache.unverified.length}
              >
                <EastIcon sx={{ color: "#000000" }} />
              </IconButton>

              <SendVerifiedButton
                callback={() => setImageListData(cache.unverified)}
              >
                Send Verified
              </SendVerifiedButton>
            </ButtonGroup>
          </FormControl>

          <Item>
            Pending: {pendingCount} | Verified: {verifiedCount < 0 ? 0 : verifiedCount}
          </Item>
        </Stack>

        <ImageList>
          {imageListData.map((entry) => (
            <ImageListItem key={entry.id}>
              <ImageListItemBar
                title={
                  <TagSelection
                    entry={entry}
                    labels={cache.labels}
                    userLabel={entry.userLabel}
                    sysLabel={entry.sysLabel}
                  />
                }
                position="below"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </Container>
  );
}
//===== *END* ImageListData *END* =======================================================
