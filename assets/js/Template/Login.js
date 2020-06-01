import React, {useState} from "react";
import {withRouter, Redirect} from "react-router-dom";

import axios from 'axios';

import {makeStyles, useTheme} from "@material-ui/core/styles";
import {Grid, TextField, Button} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Google from 'mdi-material-ui/Google';

import {GoogleLogin} from 'react-google-login';

import logo from "../../static/img/logo/dayl_logo_full.svg";
import {registerUser} from "../Api/User";
import logoDark from "../../static/img/logo/dayl_logo_full_dark.svg";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    maxWidth: 600,
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
    backgroundColor: 'transparent',
    overflowX: 'hidden'
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    width: '100%'
  },
  logo: {
    width: '50%',
  },
}));

const Login = () => {
  const classes = useStyles();
  const theme = useTheme();

  const [token, setToken] = useState(null);
  const [loginError, setLoginError] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = () => axios.post(
    process.env.API_URL + '/api/login_check',
    {
      "username": username,
      "password": password
    },
    {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .catch(res => {
      if (401 === res.response.status) {
        setLoginError(true);
      }
    })
    .then(res => {
      if (res !== undefined) {
        localStorage.setItem('token', res.data.token)
        setLoginError(false);
        setToken(res.data.token);
      }
    });

  const handleLoginWithGoogle = response => {
    registerUser({token: response.tokenId})
      .then(res => {
        localStorage.setItem('token', res.data.token)
        setLoginError(false);
        setToken(res.data.token);
      });
  }

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const sendOnEnter = (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      login();
    }
  };

  return null !== token ? <Redirect to={'/token'}/> :
    (<div className={classes.container}>
      <Paper className={classes.paper} elevation={0}>
        <Grid container spacing={8}>
          <Grid container item classes={classes.gridItem} xs={12} justify="center">
            <img src={theme.palette.type === 'dark' ? logoDark : logo} alt="Dayl" className={classes.logo}/>
          </Grid>
          {loginError ? (
            <Grid item md={true} sm={true} xs={true}>
              <Alert variant="filled" severity="warning">
                The credentials are invalid
              </Alert>
            </Grid>) : ''}
        </Grid>
        <Grid container spacing={8}>
          <Grid item md={true} sm={true} xs={true}>
            <TextField id="username" label="Username" type="email" onChange={handleUsername}
                       fullWidth autoFocus required onKeyPress={sendOnEnter} variant="filled"/>
          </Grid>
        </Grid>
        <Grid container spacing={8}>
          <Grid item md={true} sm={true} xs={true}>
            <TextField id="password" label="Password" type="password"
                       onChange={handlePassword} fullWidth required onKeyPress={sendOnEnter} variant="filled"/>
          </Grid>
        </Grid>
        <Grid container spacing={8}>
          <Grid container item justify="center">
            <Button variant="outlined" fullWidth color="primary" size="large" onClick={login}>Login</Button>
          </Grid>
        </Grid>
        <Grid container spacing={8}>
          <Grid container item justify="center">
            <GoogleLogin
              clientId={process.env.GOOGLE_API_KEY}
              render={
                renderPropos => (
                  <Button variant="outlined" fullWidth color="secondary" startIcon={<Google/>}
                          size="large" onClick={renderPropos.onClick} disabled={renderPropos.disabled}>
                    Login with Google
                  </Button>)}
              buttonText="Login With Google"
              onSuccess={handleLoginWithGoogle}
              onFailure={() => setLoginError(true)}
              cookiePolicy={'single_host_origin'}
            />
          </Grid>
        </Grid>
      </Paper>
    </div>);
}

export default withRouter(React.memo(Login));