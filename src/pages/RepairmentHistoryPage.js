import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState } from 'react';
import axios from 'axios';

// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Popover,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Button,
} from '@mui/material';
// components

import DialogTag from './DialogTag';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/users';


// ----------------------------------------------------------------------



const TABLE_HEAD = [
    { id: 'repairDate', label: '수리 날짜', alignRight: false },
    { id: 'repairContent', label: '수리 내용', alignRight: false },
    { id: 'repairPart', label: '수리 부분', alignRight: false },
    { id: 'repairManager', label: '수리 담당자', alignRight: false },
  
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}



export default function UserPage() {
  const [userList, setUserList] = useState([])
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open2, setOpen2] = useState(false);

  // 수리 이력 추가, 수정
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [repairDate, setRepairDate] = useState('');
  const [repairContent, setRepairContent] = useState('');
  const [repairPart, setRepairPart] = useState('');
  const [repairManager, setRepairManager] = useState('');

  
  const handleClickOpen = () => {
    setOpen2(true);
  }

  const handleClose = () => {
    setOpen2(false);
  }


  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  // 수정하기 다이얼로그 열기
  const handleClickOpenEdit = () => {
    setOpenEdit(true);
  }
  // 수정하기 다이얼로그 창 닫기
  const handleCloseCreate = (row) => {
    console.log('handleCloseEdit:', row)
    if (row) {
      
      setUserList([row, ...userList]) // 없을 때 새로고침이 필요했음..

      axios.post('http://localhost:3002/repairment', row)
      .then(response => {
        console.log('Response: ', response.data);
      })
      .catch(error => {
        console.error('Error: ', error);
      })
    }
    setOpenCreate(false);
  }

  // 추가하기 다이얼로그 창 열기
  const handleClickOpenCreate = () => {
    console.log('handleClickOpenCreate')
    setRepairDate('')
    setRepairContent('')
    setRepairPart('')
    setRepairManager('')
    setOpenCreate(true);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;


  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            수리 이력
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpenCreate}>
            수리이력 추가
          </Button>
          { openCreate && <DialogTag 
            open={openCreate} 
            // onClose={handleCloseCreate} 
            title={'추가하기'}
            handleClose={handleCloseCreate}
            confirm={'추가하기'}

          />}
          
        </Stack>
        
        
        <Stack direction="column" spacing={5} >
          <Stack direction="row" spacing={5} alignSelf={'center'}>
            <img
              className="exampleimg"
              alt="MacbookPro"
              src="/assets/images/macbookpro.jpg"
              style={{ width: '300px', height: 'auto' }}
            />
            <item>
              <h1>
                설비 ID: 202007311 
                <br/>
                설비명: 맥북 프로
                <br/>
                설치 일자: 2020.07.31
              </h1>
                
            </item>
          </Stack>
        <Card>
          {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

          <Scrollbar>
           
             <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, code, repairDateDate, repairContent, repairPart, repairManager } = row;
                    // const { id, name, role, status, company, avatarUrl, isVerified, latestInspectionDate, isDefective, repairmentHistory, inspectionHistory } = row;
                    // const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox">
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell> */}

                        {/* <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl} />
                             <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{company}</TableCell>

                        <TableCell align="left">{role}</TableCell>

                        <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell>

                        <TableCell align="left">
                          <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                        </TableCell> */}
                        
                        <TableCell align="left">{repairDate}</TableCell>

                        <TableCell align="left">{repairContent}</TableCell>

                        <TableCell align="left">{repairPart}</TableCell>

                        <TableCell align="left">{repairManager}</TableCell>

                    

                        {/* <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell> */}
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer> 
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        </Stack>
       
      </Container>

    </>
  );
}
