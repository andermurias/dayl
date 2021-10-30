import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@mui/styles';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import MuiAccordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const useStyles = makeStyles((theme) => ({
  accordion: {
    boxShadow: 'none',
    margin: `${theme.spacing(1)} 0`,
    '&.Mui-expanded': {
      margin: `${theme.spacing(1)} 0`,
    },
    '&:before': {
      display: 'none',
    },
  },
  accordionExpandIcon: {
    order: -1,
    padding: `0 ${theme.spacing(0.5)}`,
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
    margin: `5px ${theme.spacing(2)} 0 0`,
    textTransform: 'uppercase',
    textAlign: 'right',
  },
  accordionSummaryContent: {
    marginLeft: 0,
    paddingLeft: theme.spacing(3),
  },
}));

const Accordion = ({title, sideTitle, children, ...rest}) => {
  const classes = useStyles();

  return (
    <MuiAccordion classes={{root: classes.accordion}} {...rest}>
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
        <Grid container item xs={6} justifyContent="flex-end">
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
    </MuiAccordion>
  );
};

Accordion.propTypes = {
  title: PropTypes.string,
  sideTitle: PropTypes.string,
  children: PropTypes.node,
};

export default React.memo(Accordion);
