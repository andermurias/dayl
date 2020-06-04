import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import SettingsBrightnessIcon from '@material-ui/icons/SettingsBrightness';

import Brightness2Icon from '@material-ui/icons/Brightness2';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import BrightnessAutoIcon from '@material-ui/icons/BrightnessAuto';

import GitHubIcon from '@material-ui/icons/GitHub';
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

import logo from "../../static/img/logo/dayl_logo_full.svg";
import logoDark from "../../static/img/logo/dayl_logo_full_dark.svg";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import {getForcedTheme, logout, isAuthenticated} from "../Common/Helper";

const useStyles = makeStyles((theme) => ({
  logo: {
    width: '33%',
    maxWidth: 100
  },
  logout: {
    fontWeight: 'bold',
    transition: 'ease all ' + theme.transitions.duration.standard + 'ms',
    '&:hover': {
      cursor: 'pointer',
      opacity: 0.5
    }
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

  let themeStatus = forceTheme || 'auto';

  const themeSteps = {
    'auto': '?theme=light',
    'light': '?theme=dark',
    'dark': '',
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid container item xs={12} justify="center">
          <img src={theme.palette.type === 'dark' ? logoDark : logo} alt="Dayl" className={classes.logo}/>
        </Grid>
        <Grid container item xs={12} justify="center">
          <Typography variant="subtitle2" component={Link} href="https://andermurias.me">
            Crafted by @andermurias
          </Typography>
        </Grid>
        <Grid container item xs={12} justify="center" alignItems="center">
          <IconButton color="primary" aria-label="Theme" component="a"
                      href={window.location.pathname + themeSteps[themeStatus]}>
            {themeStatus === 'auto' ? <BrightnessAutoIcon/> : (themeStatus === 'dark' ? <Brightness2Icon/> :
              <Brightness5Icon/>)}
          </IconButton>
          <IconButton color="primary" aria-label="Github link" component="a" href="https://github.com/andermurias/dayl">
            <GitHubIcon/>
          </IconButton>
          {isAuthenticated() ? (
          <IconButton color="primary" aria-label="Logout link" onClick={logout}>
            <ExitToAppIcon/>
          </IconButton>) : '' }
        </Grid>
      </Grid>
    </div>
  );
}

export default React.memo(Footer);