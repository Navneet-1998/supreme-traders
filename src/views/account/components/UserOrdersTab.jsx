import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// Just add this feature if you want :P
import firebaseInstance from "../../../services/firebase";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}



const row = ""

const UserOrdersTab = () => (
  <div  style={{ minHeight: '80vh' }}>
  <TableContainer>
  <Table sx={{ minWidth: 650 }} aria-label="simple table">
  <TableHead>
    <TableRow>
    <TableCell  style={{fontSize:"14px"}}>S.no</TableCell>
      <TableCell align="left" style={{fontSize:"14px"}}>Image</TableCell>
      <TableCell align="center" style={{fontSize:"14px"}}>Name</TableCell>
      <TableCell align="right" style={{fontSize:"14px"}}>Amount</TableCell>
      <TableCell align="right" style={{fontSize:"14px"}}>Status</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    
  </TableBody>
</Table>
    </TableContainer>
  </div>
);

export default UserOrdersTab;
