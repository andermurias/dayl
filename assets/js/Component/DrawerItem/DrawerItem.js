import React, {useContext} from 'react';
import {useLocation} from 'react-router-dom';
import PropTypes from 'prop-types';

import {makeStyles} from '@mui/styles';

import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';

import Link from '../../Atom/Link';

import {colors} from '../../Common/Colors';

import {AppContext} from '../../_context/AppContext';

import {item} from '../../_proptypes/drawer';
import {isDarkTheme} from '../../_config/theme';

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
  listItem: {
    listStyle: 'none',
  },
}));

const DrawerItem = ({item: {text, Icon, url, type, action, checked}, ...rest}) => {
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
    case 'switch':
      return (
        <ListItem
          dense
          onClick={() => {
            setCloseDrawer();
          }}
          classes={{container: classes.listItem}}
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
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={action}
              checked={checked}
              inputProps={{'aria-labelledby': 'switch-list-label-theme'}}
            />
          </ListItemSecondaryAction>
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
  item: PropTypes.shape(item),
};

export default React.memo(DrawerItem);
