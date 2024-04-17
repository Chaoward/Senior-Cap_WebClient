"use client";
import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";


export default function ConfirmationDialog({title="", content="", onConfirm=()=>{}, onCancel=()=>{}, open=false, id="confirm-dialog"}) {
    //NOTE: onClose will share the same function as onCancel
    return <Dialog
        id={id}
        fullScreen={false}
        open={open}
        onClose={onCancel}
    >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                {content}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button variant="contained" color="success" onClick={onConfirm}>Confirm</Button>
            <Button variant="contained" color="error" onClick={onCancel}>Cancel</Button>
        </DialogActions>
  </Dialog>;
}