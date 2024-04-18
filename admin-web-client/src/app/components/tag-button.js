import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { fullURL, cache } from "../web-api/api";

export default function TagSelection({ entry }) {
  const [value, setValue] = useState(entry.label);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setOptions(cache.labels.map((label) => ({
      label: label.sysLabel,
      value: label,
    })));
  }, []);

  const handleChange = (e, val) => {
    e.preventDefault();
    const index = cache.unverified.findIndex((item) => item === entry);
    if (index !== -1) {
      cache.unverified[index].label = val.label; 
    }
    setValue(val);
  };

  const customFilterOptions = (options, { inputValue }) => {
    const filteredOptions = options.filter(
      (option) =>
        option.label &&
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    filteredOptions.sort((a, b) => {
      const aIndex = a.label.toLowerCase().indexOf(inputValue.toLowerCase());
      const bIndex = b.label.toLowerCase().indexOf(inputValue.toLowerCase());
      return aIndex - bIndex;
    });

    return filteredOptions;
  };

  return (
    <div>
      <img width={250} height={250} src={fullURL(entry.imgURL)} alt={entry.label} />
      {options && (
        <Autocomplete
          value={value}
          inputValue={inputValue}
          onInputChange={(e, val) => setInputValue(val)}
          onChange={handleChange}
          id="tag_selection"
          options={options}
          loading={!options.length}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Label" />}
          filterOptions={customFilterOptions}
        />
      )}
    </div>
  );
}
