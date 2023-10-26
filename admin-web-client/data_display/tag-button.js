"use client";

import { cache } from "./data";
import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Grid } from "@mui/material";

export default function TagSelection({ entry }) {
  const handleInput = (e) => {
    e.preventDefault();

    const index = cache.indexOf(entry);
    console.log(e.target.value);
    cache[index].tag = e.target.value;
  };

  return (
    <div>
      <img width={250} height={250} src={entry.imageUrl} />
      <Grid>
      <label>Tag: </label>

        <FormControl variant="standard" sx={{ m: 1, minWidth: 120}}>
          <Select
            name="new_tag"
            defaultValue={entry.tag}
            onChange={handleInput}
          >
            <MenuItem value="dog">Dog</MenuItem>
            <MenuItem value="cat">Cat</MenuItem>
            <MenuItem value="none">Neither</MenuItem>
          </Select>
        </FormControl>
        </Grid>
    </div>
  );
}
