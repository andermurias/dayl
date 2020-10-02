import React, {useContext} from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Hidden from '@material-ui/core/Hidden';

import MenuIcon from '@material-ui/icons/Menu';

import Footer from '../Component/Footer';
import DrawerComponent from '../Component/DrawerComponent';
import {AppContext} from '../_context/AppContext';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    position: 'relative',
    flexDirection: 'column',
  },
  fab: {
    margin: theme.spacing(1),
    position: 'fixed',
    bottom: theme.spacing(1),
    left: theme.spacing(1),
    zIndex: 100,
  },
}));

const MainLayout = ({children}) => {
  const classes = useStyles();
  const {setOpenDrawer} = useContext(AppContext);

  return (
    <div className={classes.root}>
      <div>
        <DrawerComponent />
      </div>
      <main className={classes.content}>
        {children}
        <Footer />
        <Hidden mdUp>
          <Fab size="medium" color="secondary" aria-label="menu" className={classes.fab} onClick={setOpenDrawer}>
            <MenuIcon />
          </Fab>
        </Hidden>
      </main>
    </div>
  );
};

export default React.memo(MainLayout);
