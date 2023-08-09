import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components

import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import { fetchEquipmentData } from '../_mock/equipments';
import DialogTag from './DialogTag';



// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: '설비코드', alignRight: false },
  { id: 'company', label: '설비명', alignRight: false },
  { id: 'role', label: '설치일자', alignRight: false },
  { id: 'isVerified', label: '설치위치', alignRight: false },
  { id: 'status', label: '최신 상태', alignRight: false },
  { id: 'latestInspectionDate', label: '최종 점검일', alignRight: false },
  { id: 'isDefective', label: '수리필요여부', alignRight: false },
  { id: 'repairmentHistory', label: '수리 이력', alignRight: false },
  { id: 'inspectionHistory', label: '점검 이력', alignRight: false },
  { id: 'etc', label: '비고', alignRight: false}
  
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

// ----------------------------------------------------------------------


export default function UserPage() {
  const [userList, setUserList] = useState([])

  const [openMenu, setOpenMenu] = useState(null);

  const [currentRow, setCurrentRow] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openCreate, setOpenCreate] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);

  // ----------------------------------------------------------------------


  useEffect(() => {
    async function fetchData () {
      const equipments = await fetchEquipmentData();
      console.log('equipments =', equipments)
      setUserList(equipments);
    }
    fetchData();
  }, []);


// 수정하기 다이얼로그 열기
  const handleClickOpenEdit = () => {
    setOpenEdit(true);
  }


  // 수정하기 다이얼로그 닫기
  const handleCloseEdit = (row) => {
    console.log('handleCloseEdit:', row)
    if (row) {
      const newUserList = userList.slice() // userList 복제 (state 직접 변경 권장 X)
      const inx = newUserList.findIndex((r) => r.code === currentRow.code) // currentRow의 인덱스 찾기
      newUserList[inx] = row
      console.log('newUserList:', newUserList)
      setUserList(newUserList) // 이 방법으로 state 변경하길 권장!
      // 서버 요청
      axios.put(`http://localhost:3002/equipment/${currentRow.code}`, row)
      .then(response => {
        console.log('Response: ', response.data);
      })
      .catch(error => {
        console.error('Error: ', error);
      }) 
    }
    // 사용자가 취소하기 버튼을 클릭했을 때
    setOpenEdit(false);
    setOpenMenu(null);

  }

  // 추가하기 다이얼로그 닫기
  const handleCloseCreate = (row) => {
    console.log('handleCloseCreate:', row)
    if (row) { // 추가하기 버튼 클릭 시
      
      // 새롭게 추가된 row userList 앞에 추가
      setUserList([row, ...userList]) 

      // 서버 요청 
      axios.post('http://localhost:3002/equipment', row)
      .then(response => {
        console.log('Response: ', response.data);
      })
      .catch(error => {
        console.error('Error: ', error);
      })
    }
    // 취소 버튼 클릭 시 아무 변경 없이 다이얼로그 닫기
    setOpenCreate(false);
  }

  // 추가하기 다이얼로그 열기
  const handleClickOpenCreate = () => {
    console.log('handleClickOpenCreate')
    setOpenCreate(true); // 다이얼로그 열기
  }

  const handleOpenMenu = (event, row) => {
    console.log('select row =', row)
    setCurrentRow(row)
    setOpenMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userList.map((n) => n.name);
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


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const navigate = useNavigate();
  const routeChangeRepairmentPage = () => {
    const path = '/dashboard/repairment';
    navigate(path);
  }

  const routeChangeInspectionPage = () => {
    const path = '/dashboard/inspection';
    navigate(path);
  }

  const handleItemDelete = () => {
    console.log(currentRow);
    // 주어진 함수 통과한 원소로 새로운 배열을 만듦
    // true를 반환하면 요소를 유지하고, false를 반환하면 버린다

    const isNotCurrentRow = (element) => element.code !== currentRow.code
    setUserList(userList.filter(isNotCurrentRow)) // currentRow 삭제해 state 업데이트
    // 서버 요청 (currentRow의 code와 함께)
    axios.delete(`http://localhost:3002/equipment/${currentRow.code}`)
      .then(response => {
        console.log('Response: ', response.data);
      })
      .catch(error => {
        console.error('Error: ', error);
      })
    // let idx = user.findIndex(isNotCurrentRow)
    // console.log(idx)
    // EQUIPMENTLIST.splice(idx, 1 )
    // idx = filteredUsers.findIndex(isCurrentRow)
    // filteredUsers.splice(idx, 1 )
  }

  


  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            설비 목록
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpenCreate}>
            설비 추가
          </Button>
          {/* 사용자사 설비 추가 버튼 클릭 후 DialogTag 그림 */}
          { openCreate && <DialogTag 
            open={openCreate} 
            // onClose={handleCloseCreate} 
            title={'추가하기'}
            handleClose={handleCloseCreate}
            confirm={'추가하기'}

          />}
    
        </Stack>


        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
           
             <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={userList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, code, name, installationDate, location, state, latestInspectionDate, isDefective, repairmentHistory, inspectionHistory } = row;
                    // const { id, name, role, status, company, avatarUrl, isVerified, latestInspectionDate, isDefective, repairmentHistory, inspectionHistory } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={code} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>
                        
                        <TableCell align="left">{code}</TableCell>

                        <TableCell align="left">{name}</TableCell>

                        <TableCell align="left">{installationDate}</TableCell>

                        <TableCell align="left">{location}</TableCell>

                        <TableCell align="left">{state}</TableCell>

                        <TableCell align="left">{latestInspectionDate}</TableCell>

                        <TableCell align="left">{isDefective ? '필요' : '불필요'}</TableCell>

                        <TableCell align="left"><Button variant="text" onClick={routeChangeRepairmentPage}>확인</Button></TableCell>

                        <TableCell align="left"><Button variant="text" onClick={routeChangeInspectionPage}>확인</Button></TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, row)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
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
            count={userList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(openMenu)}
        anchorEl={openMenu}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={handleClickOpenEdit}> 
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          수정하기
        </MenuItem>
        {openEdit && <DialogTag 
          open={openEdit} 
          // onClose={handleCloseEdit} 
          title={'수정하기'}
          row={currentRow}
          handleClose={handleCloseEdit}
          confirm={'수정하기'}
        />}

        <MenuItem sx={{ color: 'error.main' }} onClick={handleItemDelete}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          삭제하기
        </MenuItem>
      </Popover>
    </>
  );
}
