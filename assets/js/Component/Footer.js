import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import logo from "../../static/img/logo/dayl_logo_full.svg";
import {makeStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";
import {logout} from "../Common/Helper";

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
  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid container item xs={12} justify="center">
          <img src={logo} alt="Dayl" className={classes.logo}/>
        </Grid>
        <Grid container item xs={12} justify="center">
          <Typography variant="subtitle1">
            <span>Crafted with love</span> - <span className={classes.logout} onClick={logout}>Logout</span>
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default Footer;