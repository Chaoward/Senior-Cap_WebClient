"use-client";
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

export default function VersionHistory({ onBack }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [newLabels, setNewLabels] = useState([]);
  const [rows, setRows] = useState([
    {
      version: "1.0.2",
      date: "1-12-2024",
      images: 4,
      labels: "3",
      size: "80MB",
      //newLabels: ["cow", "horse", "goat"],
    },
    {
      version: "1.1.1",
      date: "1-22-2024",
      images: 2,
      labels: "6",
      size: "24MB",
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

  const handleSort = (column) => {
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
                  variant="contained"
                  onClick={() => handleSort("version")}
                >
                  Version
                </Button>
              </TableCell>

              <TableCell>
                <Button variant="contained" onClick={() => handleSort("date")}>
                  Date
                </Button>
              </TableCell>

              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => handleSort("images")}
                >
                  Image
                </Button>
              </TableCell>

              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => handleSort("labels")}
                >
                  Label
                </Button>
              </TableCell>

              <TableCell>
                <Button variant="contained" onClick={() => handleSort("size")}>
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
