import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  accordion: {
    maxWidth: 1000,
    boxShadow: 'none',
    margin: `${theme.spacing(1)}px auto`,
    '&.Mui-expanded': {
      margin: `${theme.spacing(1)}px auto`,
    },
    '&:before': {
      display: 'none',
    },
  },
  accordionExpandIcon: {},
  dividerFullWidth: {
    textTransform: 'uppercase',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
  },
  dividerFullWidthRight: {
    margin: `5px ${theme.spacing(2)}px 0 0`,
    textTransform: 'uppercase',
    textAlign: 'right',
  },
}));

const AccordionComponent = ({title, sideTitle, children, ...rest}) => {
  const classes = useStyles();

  return (
    <Accordion classes={{root: classes.accordion}} {...rest}>
      <AccordionSummary
        classes={{expandIcon: classes.accordionExpandIcon}}
        expandIcon={<ExpandMoreIcon />}
        aria-label="Expand"
        aria-controls="new-task-content"
        id="new-task-header"
      >
        <Grid container item xs={6}>
          <Typography className={classes.dividerFullWidth} display="block" variant="overline">
            {title}
          </Typography>
        </Grid>
        <Grid container item xs={6} justify="flex-end">
          <Typography className={classes.dividerFullWidthRight} display="block" variant="overline">
            {sideTitle}
          </Typography>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={1}>
          <Grid container item xs={12}>
            {children}
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

AccordionComponent.propTypes = {
  title: PropTypes.string,
  sideTitle: PropTypes.string,
  children: PropTypes.node,
};

export default React.memo(AccordionComponent);
