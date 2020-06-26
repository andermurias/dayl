import {colors} from '../Common/Colors';

export const theme = (prefersDarkMode) => ({
  typography: {
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
  overrides: {
    MuiInputBase: {
      input: {
        '&:-webkit-autofill': {
          WebkitBoxShadow: '0 0 0 100px #424242 inset!important',
          WebkitTextFillColor: '#fff',
        },
      },
    },
  },
  palette: {
    type: prefersDarkMode ? 'dark' : 'light',
    background: {
      default: prefersDarkMode ? colors.mineShaft : colors.babyPowder,
    },
    text: {
      primary: prefersDarkMode ? colors.babyPowder : colors.richBlack,
    },
    primary: {
      main: prefersDarkMode ? colors.babyPowder : colors.richBlack,
    },
    secondary: {
      main: colors.orangePeel,
    },
  },
});
