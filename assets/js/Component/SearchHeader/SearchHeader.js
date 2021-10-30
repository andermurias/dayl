import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';

import {useHistory, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import moment from 'moment';

import {makeStyles} from '@mui/styles';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import SearchIcon from '@mui/icons-material/Search';

import {pagination} from '../../_proptypes/search';

const useStyles = makeStyles((theme) => ({
  title: {
    textTransform: 'capitalize',
    textAlign: 'left',
    width: '100%',
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchHeader = ({pagination}) => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const [search, setSearch] = useState(useQuery().get('s') || '');

  const {t, i18n} = useTranslation();

  const goToSearch = () => {
    const searchParams = new URLSearchParams({
      s: search,
    });

    history.push(location.pathname + '?' + searchParams.toString());
  };

  const onPressEnter = (e) => e.keyCode === 13 && goToSearch();

  return (
    <Grid container spacing={3}>
      <Grid container item xs={12}>
        <Typography variant="h2" component="h1" className={classes.title}>
          {t('search.title')}
        </Typography>
      </Grid>
      <Grid container item xs={12}>
        <Typography variant="overline" component="h3">
          {t('search.results').replace('%s', pagination.totalResults || 0)}
        </Typography>
      </Grid>
      <Grid container item xs={12}>
        <TextField
          fullWidth
          id="filled-basic"
          variant="outlined"
          label={t('search.input')}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={onPressEnter}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="search" onClick={goToSearch} size="large">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Grid>
  );
};

SearchHeader.propTypes = {
  pagination: PropTypes.shape(pagination),
};

export default React.memo(SearchHeader);
