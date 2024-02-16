import React, { useState } from "react";
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
  Button
} from "@mui/material";

export default function VersionHistory() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [rows, setRows] = useState([
    { version: '1.0.0', date: '2024-02-15', images: 10, size: '25MB' },
    { version: '1.0.1', date: '2024-02-11', images: 14, size: '32MB' },
    { version: '1.0.2', date: '2024-02-02', images: 29, size: '75MB' },
    // Add more rows as needed
  ]);
  const [sortOrder, setSortOrder] = useState('newToOld');

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
    const updatedRows = rows.filter(row => !selectedRows.includes(row.version));
    // Update the rows state
    setRows(updatedRows);
    // Clear the selected rows
    setSelectedRows([]);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const sortedRows = sortOrder === 'newToOld' ? rows.slice().reverse() : rows;

  return (
    <>
      {/* <Typography variant="h6" sx={{ mb: 2 }}>
        Verification
      </Typography> */}
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <FormControl>
          <Select value={sortOrder} onChange={handleSortOrderChange}>
            <MenuItem value="newToOld">New to Old</MenuItem>
            <MenuItem value="oldToNew">Old to New</MenuItem>
          </Select>
        </FormControl>
        <ButtonGroup>
          <Button variant="contained" color="secondary" onClick={handleDeleteSelected}>
            Delete Selected
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
              <TableCell>Size</TableCell>
              <TableCell>Select</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.map((row) => (
              <TableRow key={row.version}>
                <TableCell>{row.version}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.images}</TableCell>
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
    </>
  );
}
