import {
    Button,
    DialogActions
  } from "@mui/material";



export default function ConfirmButtonsDialog(onConfirm, onCancel) {
    if (onConfirm == null) onConfirm = () => {};
    if (onCancel == null) onCancel = () => {};


    return <DialogActions>
    <Button color="success" onClick={() => onConfirm()}>Confirm</Button>
    <Button color="error" onClick={() => onCancel()}>Cancel</Button>
  </DialogActions>
}