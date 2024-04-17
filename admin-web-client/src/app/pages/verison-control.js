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
import { fetchVersions, setRelease, cache } from "../web-api/api";
import ConfirmationDialog from "../components/ConfirmationDialog";



//===== Version Object type ===============
/**
 * version: String
 * date: ISO Date format String
 * images: int
 * labels: [{count: int, label: String}...]
 * size: int (in bytes)
 * release: bool
 * id: int
*/
//=========================================

export default function VersionHistory({ onBack }) {
  const [selectedRows, setSelectedRows] = useState([]);
  //const [newLabels, setNewLabels] = useState([]);
  const [previewVer, setVer] = useState({version: "", labels: []});
  const [rows, setRows] = useState(cache.versions);

  const [releaseVersion, setReleaseVersion] = useState(cache.release ? cache.release.version : null);
  //const [selectedRow, setSelectedRow] = useState(null);
  const [dialogToOpen, setDialog] = useState("");
  //const versionNewLabels = selectedRow ? selectedRow.newLabels : [];

  const [sortedColumn, setSortedColumn] = useState("");   //which column to sort by
  const [isAscending, setAscending] = useState(true);     //sort by ascending order?

  const handleFetch = () => {
    fetchVersions().then(json => {
      setRows(json);
      setReleaseVersion(cache.release.version);
    });
  };

  const handleCheckboxChange = (id) => {
    const newSelected = selectedRows.includes(id)
      ? selectedRows.filter((x) => x !== id)
      : [...selectedRows, id];
    setSelectedRows(newSelected);
  };

  const handleDeleteSelected = () => {
    // Filter out the selected rows
    const updatedRows = rows.filter(
      (row) => !selectedRows.includes(row.id)
    );
    // Update the rows state
    setRows(updatedRows);
    // Clear the selected rows
    setSelectedRows([]);
  };

  const handleSetRelease = () => {
    if (selectedRows.length >= 1) {
      const newId = selectedRows[0];
      if (newId == null || newId == cache.release.id)
        return;
      
      setRelease(newId).then(res => {
        setReleaseVersion(cache.release.version);
      });
    }
  };


  const handleCloseDialog = () => {
    setDialog("");
  };
  

  const handleLabelDialog = (e, ver) => {
    e.stopPropagation();
    if (ver.labels.length < 1) return;
    setVer(ver);
    setDialog("label");
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

      case "labels":
        compareFn = (a, b) => {
          return a[column].length - b[column].length;
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
  };


  const displayArrow = (column) => {
    if (sortedColumn !== column) return <></>;

    return isAscending ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>;
  };


  const parseByteSize = (size) => {
    if (size < 1024)
      return `${size} bytes`;

    let i = 1;
    while (i <= 3) {
      size /= 1024;
      if (size < 1024)
        break;
      i += 1;
    }

    switch (i) {
      case 1:
        return `${Math.round(size * 10) / 10} KB`;

      case 2:
        return `${Math.round(size * 10) / 10} MB`;
      
      default:
        return `${Math.round(size * 10) / 10} GB`;
    }
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
            color="primary"
            onClick={handleFetch}
          >
            Fetch Model Info
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setDialog("delete")}
          >
            Delete Selected
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setDialog("release")}
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
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.version}</TableCell>
                <TableCell>{new Date(row.date).toLocaleDateString('en-US')}</TableCell>
                <TableCell>{row.images}</TableCell>
                <TableCell>{row.labels.length}</TableCell>
                <TableCell>{parseByteSize(row.size)}</TableCell>
                <TableCell>
                  <Checkbox
                    onChange={() => handleCheckboxChange(row.id)}
                    checked={selectedRows.indexOf(row.id) !== -1}
                  />
                </TableCell>
                <TableCell>
                  <Button onClick={(e) => handleLabelDialog(e, row)}>
                    <KeyboardArrowDownIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      {/* Label Preview Dialog */}
      <Dialog open={dialogToOpen === "label"} onClose={handleCloseDialog}>
      <DialogTitle>Version - {previewVer.version} Labels </DialogTitle>
        <DialogContent>
          <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {previewVer.labels.map((ele, index) => (
                    <Chip
                      key={index}
                      label={`${ele.label} : ${ele.count}`}
                      variant="outlined"
                      style={{ marginRight: "10px", marginBottom: "10px" }}
                    />
                  ))}
                </div>
              </div>
            </div>
        </DialogContent>
      </Dialog>

      {/*===== Confirmation Dialogs ====================================*/}

      {/*Setting Release*/}
      <ConfirmationDialog
        id="release-prompt"
        open={dialogToOpen === "release" && selectedRows.length > 0}
        title={`Set the Release Version to ${selectedRows.length > 0 && dialogToOpen === "release" ? cache.versions.filter(x => x.id === selectedRows[0])[0].version : ""}`}
        content="This will set the release version to the first selected version, mark that model to be the lastest updated or most stable version to be downloaded by the mobile-client."
        onConfirm={() => {
          handleSetRelease();
          setDialog("");
        }}
        onCancel={() => setDialog("")}
      />

      {/*Deleting a Version*/}
      <ConfirmationDialog
        id="delete-prompt"
        open={dialogToOpen === "delete" && selectedRows.length > 0}
        title={"Remove All Selected Versions!"}
        content="This will remove the following versions from the database and archives the model files for latter deletion or recovery"
        onConfirm={() => {
          handleDeleteSelected();
          setDialog("");
        }}
        onCancel={() => setDialog("")}
      />

      {/* Dialog for displaying preview images
      <Dialog open={dialogToOpen} onClose={handleCloseDialog}>
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
