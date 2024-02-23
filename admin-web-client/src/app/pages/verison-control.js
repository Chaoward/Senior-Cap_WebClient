import React, { useState } from "react";
import {cache, fetchVersion, setRelease} from "../web-api/data";
import "../components/ConfirmDialogAction";
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
  DialogContent
} from "@mui/material";
import ConfirmButtonsDialog from "../components/ConfirmDialogAction";

export default function VersionHistory() {
  const [releaseDialog, setReleaseDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const [selectedVer, setSelectedRows] = useState([]);
  const [rows, setRows] = useState([...cache.versions]);
  const [sortOrder, setSortOrder] = useState('newToOld');

  const handleCheckboxChange = (version) => {
    /*
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
    }*/
    let i = selectedVer.indexOf(version);
    if (i >= 0)
      selectedVer.splice(i, 1);
    else
      selectedVer.push(version);

    setSelectedRows([...selectedVer]);
  };

  const handleDeleteSelected = () => {
    // Filter out the selected rows
    const updatedRows = rows.filter(row => !selectedVer.includes(row.version));
    // Update the rows state
    setRows(updatedRows);
    // Clear the selected rows
    setSelectedRows([]);
  };


  const handleRelease = () => {
    if (selectedVer.length < 1) return;
    setReleaseDialog(true);
  };


  const handleConfirm = () => {
    console.log(selectedVer[0]);
    setRelease(selectedVer[0]);
  };


  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };


  const handleFetch = () => {
    fetchVersion((resJson) => {
      setRows([...resJson.versions]);
    });
  };

  //const sortedRows = sortOrder === 'newToOld' ? rows.slice().reverse() : rows;



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
          <Button variant="contained" color="secondary" onClick={handleFetch}>
            Fetch Versions
          </Button>
          <Button variant="contained" color="secondary" onClick={handleRelease}>
            Set Release
          </Button>
          <div/>
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
              <TableCell>New Labels</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Select</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => VersionEntry(row)) }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );



  function VersionEntry(entry) {
    const handleImagePreview = ()=> {
  
    };
  
    const handleLabelPreview = ()=> {
      
    };

    //console.log(entry);
  
    return <>
    <TableRow key={entry.version}>
      <TableCell>{entry.version}</TableCell>
      <TableCell>{new Date(entry.dateTrained).toISOString().split("T")[0]}</TableCell>
      <TableCell>{entry.imagesTrained ? entry.imagesTrained.length : 0}</TableCell>
      <TableCell>{entry.newLabels ? entry.newLabels.length : 0}</TableCell>
      <TableCell>{entry.size}</TableCell>
      <TableCell>
        <Checkbox
          onChange={() => handleCheckboxChange(entry.version)}
          checked={selectedVer.indexOf(entry.version) !== -1}
        />
      </TableCell>
    </TableRow>

    {/* Set Release Dialog */}
    <Dialog open={releaseDialog} onClose={() => setReleaseDialog(true)} fullScreen={false}>
      <DialogContent>
        <DialogTitle>
          Set the Release Version to {selectedVer[0]}?
        </DialogTitle>
        {ConfirmButtonsDialog(handleConfirm, () => {setReleaseDialog(false)})}
      </DialogContent>
    </Dialog>
    </>;
  }
}
