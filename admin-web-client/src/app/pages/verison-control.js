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
      newLabels: ["cow", "horse", "goat"],
    },
    {
      version: "1.1.1",
      date: "1-22-2024",
      images: 2,
      labels: "6",
      size: "24MB",
      newLabels: ["rabbit", "cat", "daisy", "fox", "ant", "bird"],
    },
  ]);

  const [sortOrder, setSortOrder] = useState("newToOld");
  const [releaseVersion, setReleaseVersion] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const versionNewLabels = selectedRow ? selectedRow.newLabels : [];
  const [sortOrderVersion, setSortOrderVersion] = useState("newToOld");
  const [sortOrderImages, setSortOrderImages] = useState("lowToHigh");
  const [sortOrderLabels, setSortOrderLabels] = useState("lowToHigh");
  const [sortOrderSize, setSortOrderSize] = useState("lowToHigh");

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

  const handleSortOrderChange = (event, column) => {
    const selectedSortOrder = event.target.value;
    setSortOrder(selectedSortOrder);

    if (column === "version") {
      setSortOrderVersion(selectedSortOrder);
      if (selectedSortOrder === "newToOld") {
        setRows(
          [...rows].sort((a, b) => compareVersions(b.version, a.version))
        );
      } else if (selectedSortOrder === "oldToNew") {
        setRows(
          [...rows].sort((a, b) => compareVersions(a.version, b.version))
        );
      }
    }

    if (column === "images") {
      setSortOrderImages(selectedSortOrder);
      if (selectedSortOrder === "lowToHigh") {
        setRows([...rows].sort((a, b) => a.images - b.images));
      } else if (selectedSortOrder === "highToLow") {
        setRows([...rows].sort((a, b) => b.images - a.images));
      }
    }

    if (column === "labels") {
      setSortOrderLabels(selectedSortOrder);
      if (selectedSortOrder === "lowToHigh") {
        setRows(
          [...rows].sort((a, b) => {
            if (a.labels < b.labels) return -1;
            if (a.labels > b.labels) return 1;
            return 0;
          })
        );
      } else if (selectedSortOrder === "highToLow") {
        setRows(
          [...rows].sort((a, b) => {
            if (a.labels > b.labels) return -1;
            if (a.labels < b.labels) return 1;
            return 0;
          })
        );
      }
    }
    if (column === "size") {
      setSortOrderSize(selectedSortOrder);
      if (selectedSortOrder === "lowToHigh") {
        setRows([...rows].sort((a, b) => parseInt(a.size) - parseInt(b.size)));
      } else if (selectedSortOrder === "highToLow") {
        setRows([...rows].sort((a, b) => parseInt(b.size) - parseInt(a.size)));
      }
    }
  };

  // Function to compare two version strings
  const compareVersions = (versionA, versionB) => {
    const partsA = versionA.split(".").map(Number);
    const partsB = versionB.split(".").map(Number);

    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      if (partsA[i] === undefined) return -1;
      if (partsB[i] === undefined) return 1;
      if (partsA[i] > partsB[i]) return 1;
      if (partsA[i] < partsB[i]) return -1;
    }
    return 0;
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
                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="version-select-label">Version</InputLabel>
                  <Select
                    labelId="version-select-label"
                    label="Version"
                    value={sortOrderVersion}
                    onChange={(event) =>
                      handleSortOrderChange(event, "version")
                    }
                  >
                    <MenuItem value="newToOld">New to Old</MenuItem>
                    <MenuItem value="oldToNew">Old to New</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>

              <TableCell>Date</TableCell>

              <TableCell>
                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="images-sort-label">Images</InputLabel>
                  <Select
                    labelId="images-sort-label"
                    label="Images"
                    value={sortOrderImages}
                    onChange={(event) => handleSortOrderChange(event, "images")}
                  >
                    <MenuItem value="lowToHigh">Low to High</MenuItem>
                    <MenuItem value="highToLow">High to Low</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>

              <TableCell>
                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="labels-select-label">Labels</InputLabel>
                  <Select
                    labelId="labels-select-label"
                    label="Labels"
                    value={sortOrderLabels}
                    onChange={(event) => handleSortOrderChange(event, "labels")}
                  >
                    <MenuItem value="lowToHigh">Low to High</MenuItem>
                    <MenuItem value="highToLow">High to Low</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>

              <TableCell>
                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="size-sort-label">Size</InputLabel>
                  <Select
                    labelId="size-sort-label"
                    label="Size"
                    value={sortOrderSize}
                    onChange={(event) => handleSortOrderChange(event, "size")}
                  >
                    <MenuItem value="lowToHigh">Low to High</MenuItem>
                    <MenuItem value="highToLow">High to Low</MenuItem>
                  </Select>
                </FormControl>
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

      {/* Dialog for displaying preview images */}
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
      </Dialog>
    </>
  );
}
