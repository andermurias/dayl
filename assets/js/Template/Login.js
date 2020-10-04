import React, {useContext, useEffect, useState} from 'react';

import {GoogleLogin} from 'react-google-login';
import {useTranslation} from 'react-i18next';

import {makeStyles, useTheme} from '@material-ui/core/styles';
import {Grid, Button} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';

import Google from 'mdi-material-ui/Google';

import {AppContext} from '../_context/AppContext';
import {useUserApi} from '../_hook/useUserApi';

import logo from '../../static/img/logo/dayl_logo_full.svg';
import logoDark from '../../static/img/logo/dayl_logo_full_dark.svg';
import {colors} from '../Common/Colors';

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
    background: colors.mineShaft,
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
      background: `linear-gradient(to top right, hsla(0,0%,13%, 1), hsl(0,0%,13%, 0))`,
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
    filter: 'grayscale(1) brightness(50%) contrast(150%)',
    mixBlendMode: 'luminosity',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
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
      <div className={classes.panel}>
        <img src="https://source.unsplash.com/1080x1920/?nature" className={classes.image} />
        <Paper className={classes.paper} elevation={0}>
          <Grid container spacing={8}>
            <Grid container item classes={classes.gridItem} xs={12} justify="flex-start">
              <a href="/" className={classes.logoContainer}>
                <img src={theme.palette.type === 'dark' ? logoDark : logo} alt="Dayl" className={classes.logo} />
              </a>
            </Grid>
            <Grid container item xs={12} justify="flex-start">
              <Typography variant="h4">{t('login.message')}</Typography>
              <Typography variant="h6">Accede con Google para seguir utilizando Dayl</Typography>
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
                    variant="outlined"
                    fullWidth
                    color="secondary"
                    startIcon={<Google />}
                    size="medium"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
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
    </div>
  );
};

export default React.memo(Login);
