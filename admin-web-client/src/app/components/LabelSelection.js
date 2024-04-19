import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { cache } from "../web-api/api";

export default function LabelSelection({userLabel="", sysLabel="", onSysChange, onUserChange, options=[...cache.labels], sx={ width: 300 }}) {
    const [inputValue, setInputValue] = useState("");
  
    const customFilterOptions = (options, { inputValue }) => {
      const filteredOptions = options.filter(
        (option) =>
          option &&
          option.toLowerCase().includes(inputValue.toLowerCase()) &&
          inputValue != ""
      );
  
      filteredOptions.sort((a, b) => {
          if (a > b)
            return 1;
          else if (a < b)
            return -1;
          else
            return 0;
      });
  
      //returns first 30 options
      return filteredOptions.length > 30 ? filteredOptions.slice(0, 30) : filteredOptions;
    };

    return (<>
        {options && (
            <Autocomplete
              value={sysLabel}
              inputValue={inputValue}
              onInputChange={(e, val) => setInputValue(val)}
              onChange={onSysChange}
              id="sys-label"
              options={options}
              loading={!options.length}
              sx={sx}
              renderInput={(params) => <TextField {...params} label="System Label" />}
              filterOptions={customFilterOptions}
            />
          )}
          <TextField 
            id="user-label" 
            label="User Label"
            variant="standard"
            sx={sx}
            value={userLabel} 
            onChange={onUserChange}
          />
    </>);
}