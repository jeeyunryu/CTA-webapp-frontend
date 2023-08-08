import React, { useState } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogContentText, 
    TextField, 
    DialogActions, 
    Button 
} from '@mui/material';

function DialogTag(props) {
  // const row = Object.assign({}, props.row ?? {
  //   code: '',
  //   name: '',
  //   installationDate: '',
  //   location: ''
  // })
  const [code, setCode] = useState(props.row?.code ?? '')
  const [name, setName] = useState(props.row?.name ?? '')
  const [installationDate, setInstallationDate] = useState(props.row?.installationDate ?? '' )
  const [location, setLocation] = useState(props.row?.location ?? '')

  const row = {
    code, name, installationDate, location
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
                <TextField 
                  margin="dense"
                  label="설치 일자"
                  fullWidth
                  variant="standard"
                  // value={row.installationDate}
                  value={installationDate}
                  onChange={(ev) => setInstallationDate(ev.target.value)}
                  // onChange={(ev) => row.installationDate = ev.target.value}
                />
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