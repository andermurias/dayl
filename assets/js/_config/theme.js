import {colors} from '../Common/Colors';
import {alpha} from '@mui/material';

export const isDarkTheme = (theme) => theme.palette.mode === 'dark';

export const theme = (prefersDarkMode) => ({
  components: {
    MuiButton: {
      disableElevation: true,
    },
  },
  typography: {
    body2: {},
    h1: {
      fontFamily: '"Montserrat"',
    },
    h2: {
      fontFamily: '"Lato"',
    },
    h3: {
      fontFamily: '"Montserrat"',
    },
    h4: {
      fontFamily: '"Montserrat"',
    },
    h5: {
      fontFamily: '"Montserrat"',
    },
    h6: {
      fontFamily: '"Montserrat"',
    },
    overline: {
      fontFamily: '"Montserrat"',
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #424242 inset!important',
            WebkitTextFillColor: '#fff',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '& td': {
            borderColor: prefersDarkMode ? alpha(colors.gallery, 0.05) : alpha(colors.mineShaft, 0.05),
          },
          '& th': {
            borderColor: prefersDarkMode ? alpha(colors.gallery, 0.05) : alpha(colors.mineShaft, 0.05),
          },
          '&:last-child td': {
            borderBottom: 0,
          },
        },
      },
    },
  },
  palette: {
    mode: prefersDarkMode ? 'dark' : 'light',
    background: {
      default: prefersDarkMode ? colors.mineShaft : colors.gallery,
      paper: prefersDarkMode ? colors.mineShaftLighter : colors.wildSand,
    },
    text: {
      primary: prefersDarkMode ? colors.gallery : colors.mineShaft,
      secondary: prefersDarkMode ? colors.gallery : colors.mineShaft,
    },
    primary: {
      main: prefersDarkMode ? colors.wildSand : colors.mineShaft,
    },
    secondary: {
      main: colors.orangePeel,
    },
  },
});
