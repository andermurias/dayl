import React, {useState} from 'react';
import {withRouter, Redirect} from 'react-router-dom';

//import axios from 'axios';

import {makeStyles, useTheme} from '@material-ui/core/styles';
import {Grid, TextField, Button} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Google from 'mdi-material-ui/Google';

import {useTranslation} from 'react-i18next';

import {GoogleLogin} from 'react-google-login';

import logo from '../../static/img/logo/dayl_logo_full.svg';
import {registerUser} from '../Api/User';
import logoDark from '../../static/img/logo/dayl_logo_full_dark.svg';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    maxWidth: 600,
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    width: '100%',
  },
  logoContainer: {
    width: '50%',
  },
  logo: {
    width: '100%',
  },
}));

const Login = () => {
  const classes = useStyles();
  const theme = useTheme();

  const {t} = useTranslation();

  const [token, setToken] = useState(null);
  const [loginError, setLoginError] = useState(false);

  const handleLoginWithGoogle = (response) => {
    registerUser({token: response.tokenId}).then((res) => {
      localStorage.setItem('token', res.data.token);
      document.cookie = 'logged=true';
      setLoginError(false);
      setToken(res.data.token);
    });
  };

  return null !== token ? (
    <Redirect to={'/token'} />
  ) : (
    <div className={classes.container}>
      <Paper className={classes.paper} elevation={0}>
        <Grid container spacing={8}>
          <Grid container item classes={classes.gridItem} xs={12} justify="center">
            <a href="/" className={classes.logoContainer}>
              <img src={theme.palette.type === 'dark' ? logoDark : logo} alt="Dayl" className={classes.logo} />
            </a>
          </Grid>
          {loginError ? (
            <Grid item md={true} sm={true} xs={true}>
              <Alert variant="filled" severity="warning">
                {t('login.credentials.invalid')}
              </Alert>
            </Grid>
          ) : (
            ''
          )}
        </Grid>
        <Grid container spacing={8}>
          <Grid container item justify="center">
            <GoogleLogin
              clientId={process.env.GOOGLE_API_KEY}
              render={(renderPropos) => (
                <Button
                  variant="outlined"
                  fullWidth
                  color="secondary"
                  startIcon={<Google />}
                  size="large"
                  onClick={renderPropos.onClick}
                  disabled={renderPropos.disabled}
                >
                  {t('login.google')}
                </Button>
              )}
              buttonText={t('login.google')}
              onSuccess={handleLoginWithGoogle}
              onFailure={() => setLoginError(true)}
              cookiePolicy={'single_host_origin'}
            />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default withRouter(React.memo(Login));
