import React from "react";
import { Button } from "@mui/material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

export default function TrainModelBtn() {
  return (
    <Button
      startIcon={<LightbulbIcon style={{ color: "#1d1128" }} />}
      color="secondary"
      sx={{
        mr: "1",
      }}
    >
      Train Model
    </Button>
  );
}
