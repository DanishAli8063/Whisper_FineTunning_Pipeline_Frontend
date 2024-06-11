import React, { useState, useEffect, useRef, useContext } from 'react';
import { UserContext } from './UserContext';
import './DataTable.css';
import {
  Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Paper, TextField, Select, MenuItem, FormControl, InputLabel, Button
} from '@mui/material';
import axios from 'axios';
import AudioPlayer from './AudioPlayer';
import config from './Config';
const DataTable = () => {
  const { setUserName, userName, userId, setUserId } = useContext(UserContext);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState('');
  const [editingRowId, setEditingRowId] = useState(null);
  const [newTranscript, setNewTranscript] = useState('');
  const [currentAudio, setCurrentAudio] = useState(null);
  
  const audioRef = useRef(null);

  const fetchClientCampaignData = (userEmail) => {
    fetch(`${config.apiBaseUrl}/Transcript_Chunk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: userEmail }),
    })
      .then(response => response.json())
      .then(data => {
        const formattedData = data.map((item, index) => ({
          id: index + 1,
          fileName: item.fileName,
          speaker: item.speaker,
          transcript: item.transcript,
          audio: item.audio,
          date: item.date,  // Ensure that the date field is included in the data
        }));
        setRows(formattedData);
      })
      .catch(error => console.error('Error fetching campaign data:', error));
  };

  useEffect(() => {
    fetchClientCampaignData(userName);
  }, [userName]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSpeakerChange = (event) => {
    setSelectedSpeaker(event.target.value);
  };

  const handleDoubleClick = (row) => {
    setEditingRowId(row.id);
    setNewTranscript(row.transcript);
  };

  const handleTranscriptChange = (event) => {
    setNewTranscript(event.target.value);
  };

  const handleSaveTranscript = (rowId) => {
    const updatedRow = rows.find(row => row.id === rowId);

    fetch(`${config.apiBaseUrl}/Update_Transcript_Chunk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: updatedRow.fileName,
        transcript: newTranscript,
        user: userName
      }),
    })
      .then(response => {
        if (response.ok) {
          const updatedRows = rows.map((row) => {
            if (row.id === rowId) {
              return { ...row, transcript: newTranscript };
            }
            return row;
          });
          setRows(updatedRows);
          setEditingRowId(null);
        } else {
          console.error('Error updating transcript:', response.statusText);
        }
      })
      .catch(error => console.error('Error updating transcript:', error));
  };
 
  const convertDateToISO = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };

  const filteredRows = rows.filter(row => {
    const isSpeakerMatch = selectedSpeaker === '' || selectedSpeaker === 'none' || row.speaker === selectedSpeaker;
    const isDateMatch = selectedDate === '' || convertDateToISO(row.date) === selectedDate;
    return isSpeakerMatch && isDateMatch;
  });

  const currentRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <div className="filter-container">
        <TextField
          label="Select Date"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
          className="date-picker"
        />

        <FormControl className="speaker-select">
          <InputLabel id="speaker-select-label">Speaker</InputLabel>
          <Select
            labelId="speaker-select-label"
            value={selectedSpeaker}
            label="Speaker"
            onChange={handleSpeakerChange}
          >
            <MenuItem value="none"><em>None</em></MenuItem>
            <MenuItem value="Bot">Bot</MenuItem>
            <MenuItem value="Customer">Customer</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Paper>
        <TableContainer className='table-contain'>
          <MuiTable>
            <TableHead className='tablehead'>
              <TableRow>
                <TableCell className='table-heading'>ID</TableCell>
                <TableCell className='table-heading'>Speaker</TableCell>
                <TableCell className='table-heading'>Transcript</TableCell>
                {/* <TableCell className='table-heading'>Play Audio</TableCell> */}
                <TableCell className='table-heading'>Player</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                    No data to display !
                  </TableCell>
                </TableRow>
              ) : (
                currentRows.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.speaker}</TableCell>
                    <TableCell onDoubleClick={() => handleDoubleClick(row)} className="row-width">
                      {editingRowId === row.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <TextField
                            value={newTranscript}
                            onChange={handleTranscriptChange}
                            onBlur={() => handleSaveTranscript(row.id)}
                            autoFocus
                            className="textFieldStyle"
                            multiline
                          />
                          <Button variant="contained" onClick={() => handleSaveTranscript(row.id)} style={{ marginTop: '4px', borderRadius: "50px", padding: "1px 0px 0px 1px", backgroundColor: "#3F2A7E" }}>
                            Save
                          </Button>
                        </div>
                      ) : (
                        row.transcript
                      )}
                    </TableCell>
                    <TableCell>
                      <AudioPlayer audioFileName={row.audio} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </MuiTable>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <audio ref={audioRef} controls style={{display:"none"}} />
    </>
  );
};

export default DataTable;
