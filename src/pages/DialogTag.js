import React, { useState } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogContentText, 
    TextField, 
    DialogActions, 
    Button,
} from '@mui/material';

// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import dayjs from 'dayjs';
import { format } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function toDate (date) {
  // console.log('toDate:', date)
  // console.log('toDate: typeof date =', typeof date)
  if (date) {
    if (typeof date === 'string') {
      return new Date(date)
    }
    return date
  }
  return new Date()
}

function DialogTag(props) {
  // const row = Object.assign({}, props.row ?? {
  //   code: '',
  //   name: '',
  //   installationDate: '',
  //   location: ''
  // })
  // console.log('currentRow: ', props.row)
  const id = props.row?.id ?? 0
  const [code, setCode] = useState(props.row?.code ?? '') // 추가 시 ->  빈값 설정, 수정 시 -> 해당 row 의 값이 저장됨
  const [name, setName] = useState(props.row?.name ?? '')
  const date = toDate(props.row?.installationDate)
  // console.log('$$$date =', date, typeof date)
  const [installationDate, setInstallationDate] = useState(date)
  const [location, setLocation] = useState(props.row?.location ?? '')
  // console.log('date=', installationDate);
  const row = {
    id, code, name, installationDate, location
  }
  
    return (
      <Dialog open={props.open} onClose={props.onClose}>
              <DialogTitle>{props.title}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  장치를 추가하기 위해 아래 폼을 작성해주세요
                </DialogContentText>
                <TextField 
                  margin="dense"
                  label="설비코드"
                  fullWidth
                  variant="standard"
                  // value={props.value1}
                  // value={row.code}
                  value={code}
                  // onChange={(ev) => row.code = ev.target.value }
                  onChange={(ev) => setCode(ev.target.value) }
                />
                <TextField 
                  margin="dense"
                  label="설비명"
                  fullWidth
                  variant="standard" 
                  // value={row.name}
                  value={name}
                  // onChange={(ev) => row.name = ev.target.value}
                  onChange={(ev) => setName(ev.target.value)}
                />
                {/* <TextField 
                  margin="dense"
                  label="설치 일자"
                  fullWidth
                  variant="standard"
                  // value={row.installationDate}
                  value={installationDate}
                  onChange={(ev) => setInstallationDate(ev.target.value)}
                  // onChange={(ev) => row.installationDate = ev.target.value}
                /> */}
                 {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker label="Basic date picker" />
                  </DemoContainer>
                </LocalizationProvider> */}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="설치 일자"
                    // value={installationDate ? format(installationDate, 'MM-dd-yyyy') : ''}
                    value={installationDate}
                    onChange={(newValue) => {
                      console.log('create: date =', newValue)
                      console.log('create: typeof date =', typeof newValue)
                      setInstallationDate(newValue)
                    }}
                    slotProps={{
                      textField: {
                        variant: 'standard',
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>
                {/* <DatePicker /> */}
                
                <TextField 
                  margin="dense"
                  label="설치 위치"
                  fullWidth
                  variant="standard"
                  // value={row.location}
                  value={location}
                  // onChange={(ev) => row.location = ev.target.value}
                  onChange={(ev) => setLocation(ev.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => props.handleClose()}>취소</Button>
                <Button onClick={() => props.handleClose(row)}>{props.confirm}</Button>
              </DialogActions>
            </Dialog>
    );
  }

  export default DialogTag;