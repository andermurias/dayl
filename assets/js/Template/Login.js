import React, {useContext, useEffect, useState} from 'react';

import {GoogleLogin} from 'react-google-login';
import {useTranslation} from 'react-i18next';

import {makeStyles, useTheme} from '@material-ui/core/styles';
import {Grid, Button} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import Google from 'mdi-material-ui/Google';

import {AppContext} from '../_context/AppContext';
import {useUserApi} from '../_hook/useUserApi';

import logo from '../../static/img/logo/dayl_logo_full.svg';
import logoDark from '../../static/img/logo/dayl_logo_full_dark.svg';

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

  const {setToken, setLoading} = useContext(AppContext);
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const {registerUser} = useUserApi();

  const handleLoginWithGoogle = (response) => {
    registerUser({token: response.tokenId}).then((res) => {
      localStorage.setItem('refreshToken', res.data.refresh_token);
      document.cookie = 'logged=true; expires=Fri, 31 Dec 9999 23:59:59 GMT;';
      setLoginError(false);
      setToken(res.data.token);
    });
  };

  return (
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
                  size="medium"
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

export default React.memo(Login);
