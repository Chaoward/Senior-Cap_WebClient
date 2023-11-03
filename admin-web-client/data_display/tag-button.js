"use client";

import { cache } from "./data";
import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Grid } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';

export default function TagSelection({ entry }) {
  const handleInput = (e) => {
    e.preventDefault();

    const index = cache.indexOf(entry);
    console.log(e.target.value);
    cache[index].Label = e.target.value;
  };

  const labels_select = [
    { label: 'Dog', value:"dog"},
    { label: 'Cat', value:"cat"},
    { label: 'Horse', value:"horse"},
    { label: 'Neither', value:"either"}
  ];

  return (
    <div>
      <img width={250} height={250} src={entry.imageUrl} />
      <Grid>
        <label>Tag: </label>

        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <Autocomplete
            disablePortal
            id="tag_selection"
            options={labels_select}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Label" />}
          />

          
          {/* <Select
            name="new_tag"
            defaultValue={entry.Label}
            onChange={handleInput}
          >
            <MenuItem value="dog">Dog</MenuItem>
            <MenuItem value="cat">Cat</MenuItem>
            <MenuItem value="None">Neither</MenuItem>
          </Select> */}
        </FormControl>
      </Grid>
    </div>
  );
}
