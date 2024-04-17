"use client";
import React, {useState} from "react";
import { Button, } from "@mui/material";
import { trainModel } from "../web-api/api";
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';


export default function TrainModelBtn() {
  const [isDisable, setDisable] = useState(false);

  const handleClick = () => {
    setDisable(true);
    trainModel().then(res => {
      if (!res.success) {
        console.error(res.error);
      }

      setDisable(false);
    });
  };

  return (
    <Button color="secondary" disabled={isDisable} onClick={handleClick}>
      <ModelTrainingIcon sx={{ mr: 1, color: "#1d1128" }} /> Train Model
    </Button>
  );
}
