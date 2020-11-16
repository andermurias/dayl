import React, {useContext, useEffect, useState} from 'react';

import {GoogleLogin} from 'react-google-login';
import {useTranslation} from 'react-i18next';

import {makeStyles, useTheme} from '@material-ui/core/styles';
import {Grid, Button} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';

import GoogleIcon from '../Icons/Google';

import {AppContext} from '../_context/AppContext';
import {useUserApi} from '../_hook/useUserApi';

import logo from '../../static/img/logo/dayl_logo_full.svg';
import logoDark from '../../static/img/logo/dayl_logo_full_dark.svg';
import {colors} from '../Common/Colors';
import {isDarkTheme} from '../_config/theme';

import {fade} from '@material-ui/core/styles';
import {Redirect} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 520,
    margin: theme.spacing(8, 4),
    padding: theme.spacing(2),
    backgroundColor: 'transparent',
    overflow: 'hidden',
    zIndex: 10,
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    minHeight: '100%',
    maxHeight: 'calc(100vh - 1px)',
    width: '100%',
    flexGrow: 1,
  },
  panel: {
    flexGrow: 1,
    width: '100%',
    display: 'flex',
    background: isDarkTheme(theme) ? colors.mineShaft : colors.wildSand,
    position: 'relative',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    '&::after': {
      content: "''",
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      background: `linear-gradient(to top right, 
        ${fade(isDarkTheme(theme) ? colors.mineShaft : colors.wildSand, 1)} 30%,
        ${fade(isDarkTheme(theme) ? colors.mineShaft : colors.wildSand, 0)}
        )`,
      zIndex: 5,
    },
  },
  logoContainer: {
    width: '66%',
  },
  logo: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    flexGrow: 1,
    opacity: 0.7,
    filter: 'grayscale(1) brightness(75%) contrast(175%)',
    mixBlendMode: isDarkTheme(theme) ? 'lighten' : 'darken',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  login: {
    background: '#FFFFFF',
    justifyContent: 'flex-start',
    padding: theme.spacing(1),
    border: 'solid 1px ' + (isDarkTheme(theme) ? colors.mineShaftLighter : colors.gallery),
    '&:hover': {
      background: colors.gallery,
    },
  },
  loginIcon: {
    marginRight: theme.spacing(3),
    marginLeft: 0,
  },
  loginText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.54)',
    fontWeight: 500,
  },
}));

const Login = () => {
  const classes = useStyles();
  const theme = useTheme();

  const {t} = useTranslation();

  const {setToken, token, setLoading} = useContext(AppContext);
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const {registerUser} = useUserApi();

  const googleScope = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.events.readonly',
  ];

  const handleLoginWithGoogle = (response) => {
    registerUser({code: response.code}).then((res) => {
      localStorage.setItem('refreshToken', res.data.refresh_token);
      document.cookie = 'logged=true; expires=Fri, 31 Dec 9999 23:59:59 GMT;';
      setLoginError(false);
      setToken(res.data.token);
    });
  };

  const rToken = localStorage.getItem('refreshToken');

  if (token !== null || rToken) {
    return <Redirect to={{pathname: '/tasks'}} />;
  }

  return (
    <div className={classes.container}>
      <div className={classes.panel}>
        <img src="https://source.unsplash.com/1920x1080/?nature" className={classes.image} />
        <Paper className={classes.paper} elevation={0}>
          <Grid container spacing={8}>
            <Grid container item classes={classes.gridItem} xs={12} justify="flex-start">
              <a href="/" className={classes.logoContainer}>
                <img src={theme.palette.type === 'dark' ? logoDark : logo} alt="Dayl" className={classes.logo} />
              </a>
            </Grid>
            <Grid container item xs={12} justify="flex-start">
              <Typography variant="h4">{t('login.message')}</Typography>
              <Typography variant="h6">{t('login.submessage')}</Typography>
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
            <Grid container item justify="center">
              <GoogleLogin
                clientId={process.env.GOOGLE_API_KEY}
                render={(renderProps) => (
                  <Button
                    variant="contained"
                    fullWidth
                    classes={{root: classes.login, label: classes.loginText, startIcon: classes.loginIcon}}
                    color="secondary"
                    startIcon={<GoogleIcon />}
                    size="medium"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    {t('login.google')}
                  </Button>
                )}
                responseType="code"
                buttonText={t('login.google')}
                onSuccess={handleLoginWithGoogle}
                onFailure={(err) => {
                  console.log('ERR => ', err);
                  debugger;
                  setLoginError(true);
                }}
                cookiePolicy={'single_host_origin'}
                scope={googleScope.join(' ')}
                accessType="offline"
                prompt={'consent'}
              />
            </Grid>
          </Grid>
        </Paper>
      </div>
    </div>
  );
};

export default React.memo(Login);
