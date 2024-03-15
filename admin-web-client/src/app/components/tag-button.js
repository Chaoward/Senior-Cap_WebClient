"use client";

import { cache, fullURL } from "../web-api/api";
import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Grid } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';

export default function TagSelection({ entry }) {
  const [value, setValue] = React.useState(entry.label);

  const handleChange = (e, val) => {
    e.preventDefault();
    if (val === value) return;

    const index = cache.unverified.indexOf(entry);
    console.log(val);
    //console.log(e.target.value);
    cache.unverified[index].label = val;
    setValue(val);
    console.log(cache.unverified);
  };


  /*
  const labels_select = [
    { label: 'Dog', value:"dog"},
    { label: 'Cat', value:"cat"},
    { label: 'Horse', value:"horse"},
    { label: 'Neither', value:"either"}
  ];*/

  return (
    <div>
      <img width={250} height={250} src={fullURL(entry.imgURL)} />
      <Grid>
        <label>Tag: </label>

        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <Autocomplete
            value={value}
            onChange={handleChange}
            id="tag_selection"
            options={ cache.labels }
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="label" />}
          />

          
          {/* <Select
            name="new_tag"
            defaultValue={entry.label}
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
