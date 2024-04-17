"use client";
import React, {useState} from "react";
import { Button, } from "@mui/material";
import { trainModel } from "../web-api/api";
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import ConfirmationDialog from "./ConfirmationDialog";


export default function TrainModelBtn() {
  const [isDisable, setDisable] = useState(false);
  const [open, setOpen] = useState(false);

  const train = () => {
    setDisable(true);
    trainModel().then(res => {
      if (!res.success) {
        console.error(res.error);
      }
      setDisable(false);
    });
  };

  return (<>
    <Button color="secondary" disabled={isDisable} onClick={() => setOpen(true)}>
      <ModelTrainingIcon sx={{ mr: 1, color: "#1d1128" }} /> Train Model
    </Button>

    <ConfirmationDialog
      id="train-prompt"
      open={open}
      title="Fine Tune Model?"
      content="This will start the training process to fine tune the most recent model on the database."
      onConfirm={() => {
        train();
        setOpen(false);
      }}
      onCancel={() => setOpen(false)}
    />
  </>);
}
