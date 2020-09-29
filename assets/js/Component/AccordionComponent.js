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
    boxShadow: 'none',
    margin: `${theme.spacing(1)}px 0`,
    '&.Mui-expanded': {
      margin: `${theme.spacing(1)}px 0`,
    },
    '&:before': {
      display: 'none',
    },
  },
  accordionExpandIcon: {
    order: -1,
    padding: `0 ${theme.spacing(0.5)}px`,
    marginRight: 0,
  },
  dividerFullWidth: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
  },
  dividerFullWidthRight: {
    fontWeight: 'bold',
    margin: `5px ${theme.spacing(2)}px 0 0`,
    textTransform: 'uppercase',
    textAlign: 'right',
  },
  accordionSummaryContent: {
    marginLeft: 0,
    paddingLeft: `${theme.spacing(3)}px`,
  },
}));

const AccordionComponent = ({title, sideTitle, children, ...rest}) => {
  const classes = useStyles();

  return (
    <Accordion classes={{root: classes.accordion}} {...rest}>
      <AccordionSummary
        classes={{content: classes.accordionSummaryContent, expandIcon: classes.accordionExpandIcon}}
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
