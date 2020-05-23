import React from "react";
import {withRouter} from "react-router-dom";

import {withStyles, Grid, TextField, Button} from '@material-ui/core';

const styles = theme => ({
  content: {
    maxWidth: 600,
    width: '100%',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100%'
  }
});

const Login = ({classes}) => {
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Grid container spacing={8}>
          <Grid item md={true} sm={true} xs={true}>
            <TextField id="username" label="Username" type="email" fullWidth autoFocus required variant="outlined"/>
          </Grid>
        </Grid>
        <Grid container spacing={8}>
          <Grid item md={true} sm={true} xs={true}>
            <TextField id="username" label="Password" type="password" fullWidth required variant="outlined"/>
          </Grid>
        </Grid>
        <Grid container justify="center" style={{marginTop: '30px'}}>
          <Button variant="outlined" fullWidth color="primary">Login</Button>
        </Grid>
      </div>
    </div>
  );
}

export default withRouter(withStyles(styles)(Login));