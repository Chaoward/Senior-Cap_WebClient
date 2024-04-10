import React, { useState, useEffect } from "react";
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Toolbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  FormControl,
  Select,
  MenuItem,
  ButtonGroup,
  InputLabel,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

//===== Version Object type ===============
/**
 * version: String
 * data: ISO Date format String
 * images: int
 * labels: int
 * size: float (in MB)
 * 
*/
//=========================================

export default function VersionHistory({ onBack }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [newLabels, setNewLabels] = useState([]);
  const [rows, setRows] = useState([
    {
      version: "1.0.2",
      date: "2024-1-12",
      images: 4,
      labels: 3,
      size: 80.2,
      //newLabels: ["cow", "horse", "goat"],
    },
    {
      version: "1.1.1",
      date: "2024-1-22",
      images: 2,
      labels: 6,
      size: 24.1,
      //newLabels: ["rabbit", "cat", "daisy", "fox", "ant", "bird"],
    },
  ]);

  const [releaseVersion, setReleaseVersion] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  //const versionNewLabels = selectedRow ? selectedRow.newLabels : [];
  const [sortOrder, setSortOrder] = useState({
    version: "newToOld",
    date: "newToOld",
    images: "lowToHigh",
    labels: "lowToHigh",
    size: "lowToHigh",
  });

  const [sortedColumn, setSortedColumn] = useState("");   //which column to sort by
  const [isAscending, setAscending] = useState(true);     //sort by ascending order?

  const handleCheckboxChange = (version) => {
    const newSelected = selectedRows.includes(version)
      ? selectedRows.filter((v) => v !== version)
      : [...selectedRows, version];
    setSelectedRows(newSelected);
  };

  const handleDeleteSelected = () => {
    // Filter out the selected rows
    const updatedRows = rows.filter(
      (row) => !selectedRows.includes(row.version)
    );
    // Update the rows state
    setRows(updatedRows);
    // Clear the selected rows
    setSelectedRows([]);
  };

  const handleSetRelease = () => {
    if (selectedRows.length === 1) {
      const selectedRow = rows.find((row) => row.version === selectedRows[0]);
      if (selectedRow) {
        // Set the release version label
        setReleaseVersion(selectedRow.version);
      }
    }
  };

  const handleDialogOpen = (event, row) => {
    event.stopPropagation();
    setSelectedRow(row);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  /**
   * 
   * @param {String} column The key name of the column to sort by
   */
  const handleSort = (column) => {
    //check col to sort by, only change order and return if the same as current sorted column
    if (column === sortedColumn) {
      rows.reverse();
      setAscending(!isAscending);
      return;
    }

    //when column != sortedColumn, set sorting function
    let compareFn = null;
  
    switch (column) {
      case "version":
        compareFn = (a, b) => {
          if (a[column] > b[column])
            return 1;
          else if (a[column] < b[column])
            return -1;
          else
            return 0;
        };
      break;

      case "date":
        compareFn = (a, b) => {
          let firstDate = new Date(a[column]);
          let secondDate = new Date(b[column]);
          return firstDate.getTime() - secondDate.getTime();
        };
      break;

      //default number type comparsion
      default:
        compareFn = (a, b) => {
          return a[column] - b[column];
        };
    }
    
    //sort and save state
    rows.sort(compareFn);
    setRows( [...rows.reverse()] );
    setSortedColumn(column);
    setAscending(false);

    // OLD
    /*
    const newSortOrder = { ...sortOrder };

    if (newSortOrder[column] === "newToOld") {
      newSortOrder[column] = "oldToNew";
      setRows([...rows].sort((a, b) => (a[column] > b[column] ? 1 : -1)));
    } else if (newSortOrder[column] === "oldToNew") {
      newSortOrder[column] = "newToOld";
      setRows([...rows].sort((a, b) => (a[column] < b[column] ? 1 : -1)));
    } else if (newSortOrder[column] === "lowToHigh") {
      newSortOrder[column] = "highToLow";
      setRows([...rows].sort((a, b) => a[column] - b[column]));
    } else {
      newSortOrder[column] = "lowToHigh";
      setRows([...rows].sort((a, b) => b[column] - a[column]));
    }

    setSortOrder(newSortOrder);
    */
  };


  const displayArrow = (column) => {
    if (sortedColumn !== column) return <></>;

    return isAscending ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>;
  };

  return (
    <>
      <Typography variant="h6">
        Release: {releaseVersion ? releaseVersion : "None"}
      </Typography>

      <Toolbar sx={{ justifyContent: "space-between" }}>
        <FormControl></FormControl>

        <ButtonGroup>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteSelected}
          >
            Delete Selected
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSetRelease}
          >
            Set Release
          </Button>
        </ButtonGroup>
      </Toolbar>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Button
                  onClick={() => handleSort("version")}
                  sx={{ width: "100%" }}
                  endIcon={displayArrow("version")}
                >
                  Version
                </Button>
              </TableCell>

              <TableCell>
                <Button 
                onClick={() => handleSort("date")}
                sx={{ width: "100%" }}
                endIcon={displayArrow("date")}
                >
                  Date
                </Button>
              </TableCell>

              <TableCell>
                <Button
                  
                  onClick={() => handleSort("images")}
                  sx={{ width: "100%" }}
                  endIcon={displayArrow("images")}
                >
                  Image
                </Button>
              </TableCell>

              <TableCell>
                <Button
                  
                  onClick={() => handleSort("labels")}
                  sx={{ width: "100%" }}
                  endIcon={displayArrow("labels")}
                >
                  Label
                </Button>
              </TableCell>

              <TableCell>
                <Button 
                
                onClick={() => handleSort("size")}
                sx={{ width: "100%" }}
                endIcon={displayArrow("size")}
                >
                  Size
                </Button>
              </TableCell>

              <TableCell>Select</TableCell>
              <TableCell>Preview</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.version}>
                <TableCell>{row.version}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.images}</TableCell>
                <TableCell>{row.labels}</TableCell>
                <TableCell>{row.size}</TableCell>
                <TableCell>
                  <Checkbox
                    onChange={() => handleCheckboxChange(row.version)}
                    checked={selectedRows.indexOf(row.version) !== -1}
                  />
                </TableCell>
                <TableCell>
                  <Button onClick={(e) => handleDialogOpen(e, row)}>
                    <KeyboardArrowDownIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for displaying preview images
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Preview - Version {selectedRow?.version}</DialogTitle>
        <DialogContent>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: "10px" }}>
              <Typography variant="subtitle1">New label</Typography>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {versionNewLabels.map((label, index) => (
                  <Chip
                    key={index}
                    label={label}
                    variant="outlined"
                    style={{ marginRight: "10px", marginBottom: "10px" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
}
