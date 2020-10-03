import React, {useContext} from 'react';
import {useLocation} from 'react-router-dom';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import {Box} from '@material-ui/core';

import Link from '../../Atom/Link';

import {colors} from '../../Common/Colors';

import {AppContext} from '../../_context/AppContext';

const useStyles = makeStyles((theme) => ({
  listItemIcon: {
    minWidth: theme.spacing(5),
  },
  subHeader: {
    paddingTop: theme.spacing(2),
  },
  selectedListItem: {
    borderRight: 'solid ' + theme.spacing(0.5) + 'px ' + colors.orangePeel,
  },
}));

const DrawerItem = ({item: {text, Icon, url, type, action}, ...rest}) => {
  const classes = useStyles();
  const location = useLocation();
  const {setCloseDrawer} = useContext(AppContext);

  const isUrlSelected = (url) => url && location.pathname === url;

  switch (type) {
    case 'item':
      return (
        <ListItem
          dense
          button
          component={Link}
          to={url}
          onClick={() => {
            action();
            setCloseDrawer();
          }}
          classes={{root: isUrlSelected(url) ? classes.selectedListItem : ''}}
          {...rest}
        >
          {Icon && (
            <ListItemIcon classes={{root: classes.listItemIcon}}>
              <Icon fontSize="small" color={isUrlSelected(url) ? 'secondary' : 'primary'} />
            </ListItemIcon>
          )}
          <ListItemText
            primaryTypographyProps={{variant: 'body2', color: isUrlSelected(url) ? 'secondary' : 'primary'}}
            primary={text}
          />
        </ListItem>
      );
    case 'divider':
      return (
        <Box my={2}>
          <Divider />
        </Box>
      );
    case 'header':
      return (
        <ListSubheader classes={{root: classes.subHeader}}>
          {<Typography variant={'caption'}>{text}</Typography>}
        </ListSubheader>
      );
    default:
      return <></>;
  }
};

DrawerItem.propTypes = {
  item: PropTypes.shape({
    text: PropTypes.string,
    Icon: PropTypes.object,
    url: PropTypes.string,
    type: PropTypes.string,
    action: PropTypes.func,
  }),
};

export default React.memo(DrawerItem);
