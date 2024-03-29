import React, {useEffect, useContext, useState} from 'react';
import {styled} from '@mui/material/styles';
import {useHistory, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import moment from 'moment';

import {makeStyles} from '@mui/styles';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Grid from '@mui/material/Grid';

import {useTaskApi} from '../_hook/useTaskApi';
import {AppContext} from '../_context/AppContext';

import SearchList from '../Component/SearchList/SearchList';
import SearchHeader from '../Component/SearchHeader/SearchHeader';
import {withLayout} from '../_hoc/withLayout';
import MainLayout from '../Layout/MainLayout';

const PREFIX = 'SearchTasks';

const classes = {
  paper: `${PREFIX}-paper`,
  title: `${PREFIX}-title`,
};

const StyledPaper = styled(Paper)(({theme}) => ({
  [`&.${classes.paper}`]: {
    boxShadow: 'none',
    border: 0,
    flexGrow: 1,
    overflow: 'visible',
    padding: theme.spacing(0),
    maxWidth: 800,
    width: '100%',
    margin: `${theme.spacing(1)} auto`,
    background: 'transparent',
  },

  [`& .${classes.title}`]: {
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

const SearchTasks = () => {
  const location = useLocation();
  const history = useHistory();

  const [searchTasks, setSearchTasks] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
  });

  const {i18n} = useTranslation();

  const {setLoading} = useContext(AppContext);
  const {getTasksForSearch} = useTaskApi();

  const page = useQuery().get('page') || 1;
  const search = useQuery().get('s') || '';

  useEffect(() => {
    if (search) {
      setLoading(true);
      getTasksForSearch({search: search, page: page}).then((response) => {
        setSearchTasks(response.data.results);
        setPagination(response.data.info);
        setLoading(false);
      });
    }
  }, [location]);

  const goToPage = (e, page) => {
    const searchParams = new URLSearchParams({
      s: search,
      page: page,
    });

    history.push(location.pathname + '?' + searchParams.toString());
  };

  return (
    <StyledPaper classes={{root: classes.paper}}>
      <Grid container spacing={3}>
        <Grid container item xs={12}>
          <SearchHeader pagination={pagination} />
        </Grid>
        <Grid container item xs={12}>
          <SearchList tasks={searchTasks} />
        </Grid>
        <Grid container item xs={12} justifyContent="center">
          {!!pagination.totalPages && (
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              color="secondary"
              onChange={goToPage}
            />
          )}
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export default React.memo(SearchTasks);
