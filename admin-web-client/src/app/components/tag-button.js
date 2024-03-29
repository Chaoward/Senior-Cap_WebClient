import { useState, useEffect } from "react";
import { fullURL } from "../web-api/api";
import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function TagSelection({ entry }) {
  const [value, setValue] = React.useState(entry.label);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Generate dummy data
    const dummyLabels = [
      { label: "Dog", value: "dog" },
      { label: "Cat", value: "cat" },
      { label: "Bird", value: "bird" },
      { label: "Fish", value: "fish" },
      { label: "Rabbit", value: "rabbit" },
      { label: "Horse", value: "horse" },
      { label: "Turtle", value: "turtle" },
      { label: "Snake", value: "snake" },
      { label: "Hamster", value: "hamster" },
      { label: "Cow", value: "cow" },
      { label: "Raccoon", value: "raccoon" },
      { label: "Guinea Pig", value: "guinea_pig" },
    ];

    // Set the options in the state
    setOptions(dummyLabels);
  }, []);

  const customFilterOptions = (options, { inputValue }) => {
    // Custom filtering logic based on inputValue
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    // Custom sorting logic
    filteredOptions.sort((a, b) => {
      const aIndex = a.label.toLowerCase().indexOf(inputValue.toLowerCase());
      const bIndex = b.label.toLowerCase().indexOf(inputValue.toLowerCase());
      return aIndex - bIndex;
    });

    return filteredOptions;
  };

  return (
    <div>
      <img width={250} height={250} src={fullURL(entry.imgURL)} />
      <Autocomplete
        value={value}
        inputValue={inputValue}
        onInputChange={(e, val) => setInputValue(val)}
        onChange={(e, val) => setValue(val)}
        id="tag_selection"
        options={inputValue.length > 0 ? options : []} // Show options only if inputValue has length > 0
        loading={!options.length}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="label" />}
        filterOptions={customFilterOptions}
      />
    </div>
  );
}
