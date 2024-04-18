import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function LabelDropdown({ labels, value, onChange }) {
  return (
    <FormControl fullWidth variant="outlined" style={{ marginBottom: "8px" }}>
      <InputLabel>Add new label</InputLabel>
      <Select
        label="Add new label"
        value={value}
        onChange={onChange}
      >
        {labels.map((lab, index) => (
          <MenuItem key={index} value={lab}>
            {lab}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
