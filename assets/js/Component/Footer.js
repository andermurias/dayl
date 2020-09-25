import React, {useContext} from 'react';

import {makeStyles, useTheme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';

import Brightness2Icon from '@material-ui/icons/Brightness2';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import BrightnessAutoIcon from '@material-ui/icons/BrightnessAuto';
import GitHubIcon from '@material-ui/icons/GitHub';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ImportExportIcon from '@material-ui/icons/ImportExport';

import {getForcedTheme, logout} from '../Common/Helper';
import {AppContext} from '../_context/AppContext';

import logo from '../../static/img/logo/dayl_logo_full.svg';
import logoDark from '../../static/img/logo/dayl_logo_full_dark.svg';
import {useTaskApi} from '../_hook/useTaskApi';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  logoContainer: {
    width: '33%',
    maxWidth: 100,
  },
  logo: {
    width: '100%',
  },
  logout: {
    fontWeight: 'bold',
    transition: 'ease all ' + theme.transitions.duration.standard + 'ms',
    '&:hover': {
      cursor: 'pointer',
      opacity: 0.5,
    },
  },
  root: {
    marginTop: 25,
    marginBottom: 25,
    overflow: 'hidden',
    padding: theme.spacing(0, 3),
  },
}));

const Footer = () => {
  const classes = useStyles();

  const theme = useTheme();
  const forceTheme = getForcedTheme();

  const {getExportTask} = useTaskApi();

  const {token, currentDate} = useContext(AppContext);

  const isMediumOrDown = useMediaQuery(theme.breakpoints.down('md'));

  let themeStatus = forceTheme || 'auto';

  const themeSteps = {
    auto: '?theme=light',
    light: '?theme=dark',
    dark: '',
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid container item xs={12} md={4} justify={isMediumOrDown ? 'center' : 'flex-start'} alignItems="center">
          <a className={classes.logoContainer} href="/">
            <img src={theme.palette.type === 'dark' ? logoDark : logo} alt="Dayl" className={classes.logo} />
          </a>
        </Grid>
        <Grid container item xs={12} md={4} justify="center" alignItems="center">
          <Typography variant="subtitle2" component={Link} target="_blank" href="https://andermurias.me">
            Crafted by @andermurias
          </Typography>
        </Grid>
        <Grid container item xs={12} md={4} justify={isMediumOrDown ? 'center' : 'flex-end'} alignItems="center">
          <IconButton
            color="primary"
            aria-label="Theme"
            component="a"
            href={window.location.pathname + themeSteps[themeStatus]}
          >
            {themeStatus === 'auto' ? (
              <BrightnessAutoIcon />
            ) : themeStatus === 'dark' ? (
              <Brightness2Icon />
            ) : (
              <Brightness5Icon />
            )}
          </IconButton>
          <IconButton
            color="primary"
            aria-label="Github link"
            component="a"
            href="https://github.com/andermurias/dayl"
            target="_blank"
          >
            <GitHubIcon />
          </IconButton>
          {token ? (
            <>
              <IconButton color="primary" aria-label="Export" onClick={() => getExportTask(currentDate)}>
                <ImportExportIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Logout link" onClick={logout}>
                <ExitToAppIcon />
              </IconButton>
            </>
          ) : (
            ''
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default React.memo(Footer);
