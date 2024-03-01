import React, { useState, useEffect } from "react";
import {
  AppBar,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Toolbar,
  ButtonGroup,
  FormControl,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";

export default function VersionHistory() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [newLabels, setNewLabels] = useState([]);
  const [rows, setRows] = useState([
    {
      version: "1.0.2",
      date: "1-12-2024",
      images: 3,
      labels: "3",
      size: "80MB",
      newLabels: ["cow", "horse", "goat"],
    },
    {
      version: "1.1.1",
      date: "1-22-2024",
      images: 2,
      labels: "2",
      size: "24MB",
      newLabels: ["rabbit", "cat"],
    },
  ]);

  const [sortOrder, setSortOrder] = useState("newToOld");
  const [releaseVersion, setReleaseVersion] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const versionNewLabels = selectedRow ? selectedRow.newLabels : [];

  const handleCheckboxChange = (version) => {
    const selectedIndex = selectedRows.indexOf(version);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, version);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }

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

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const sortedRows =
    sortOrder === "newToOld"
      ? rows.slice().reverse()
      : sortOrder === "asc"
      ? [...rows].sort((a, b) => a.version.localeCompare(b.version))
      : [...rows].sort((a, b) => b.version.localeCompare(a.version));

  useEffect(() => {
    // Extract labels from rows
    const labels = rows.reduce((acc, row) => {
      return acc.concat(row.newLabels);
    }, []);
    // Remove duplicates
    const uniqueLabels = [...new Set(labels)];
    setNewLabels(uniqueLabels);
  }, [rows]);

  return (
    <>
      <Typography variant="h6">
        Release: {releaseVersion ? releaseVersion : "None"}
      </Typography>

      <Toolbar sx={{ justifyContent: "space-between" }}>
        <FormControl>
          <Select value={sortOrder} onChange={handleSortOrderChange}>
            <MenuItem value="newToOld">New to Old</MenuItem>
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
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
              <TableCell>Version</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Images</TableCell>
              <TableCell>Labels</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Select</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.map((row) => (
              <TableRow key={row.version} onClick={() => handleRowClick(row)}>
                <TableCell>{row.version}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.images}</TableCell>{" "}
                <TableCell>{row.labels}</TableCell>
                <TableCell>{row.size}</TableCell>
                <TableCell>
                  <Checkbox
                    onChange={() => handleCheckboxChange(row.version)}
                    checked={selectedRows.indexOf(row.version) !== -1}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for displaying preview images */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          Preview - Version {selectedRow?.version}
        </DialogTitle>
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
