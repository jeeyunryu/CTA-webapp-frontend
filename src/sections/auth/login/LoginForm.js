import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');



  const handleClick = () => {
    navigate('/dashboard', { replace: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password)
    const newUser = { username, password }
    axios.post(`http://localhost:3002/login`, newUser)
    .then(response => {
      console.log('Response: ', response.data);
      if (response.data.error) {
        if (response.data.error.exists === false) {
          alert('User not found!')
        }
      }
      else {
        alert('login successful')
        window.localStorage.setItem('token', JSON.stringify(response.data.token))
        window.localStorage.setItem('username', username)
        const savedPath = window.localStorage.getItem('savedPath')
        if (savedPath) {
          window.localStorage.removeItem('savedPath')
          window.location.href = savedPath
        } else {
          window.location.href = '/'
        }
        // window.location.href = window.localStorage.getItem('savedPath')
        // savedPath 있는지 확인
        // 없다면 home 으로 이동
        // 있다면 이동 후 지우기
      }
      // // if(response.data.error.exists === true) {
      // //   alert('User exists!')
      // }
    })
   
    .catch(error => {
      console.error('Error: ', error);
    })
  }

  return (
    <form>
      <Stack spacing={3}>
        <TextField name="username" label="Username" onChange={(e) => setUsername(e.target.value)}/>

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={e => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack> */}

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit} style={{marginTop: '10px'}}>
        확인
      </LoadingButton>
    </form>
  );
}
