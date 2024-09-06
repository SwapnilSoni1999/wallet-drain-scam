function pxToRem(value) {
  return `${value / 16}rem`;
}

function responsiveFontSizes({ xs, sm, md, lg, xl }) {
  return {
    "@media (min-width:0px)": {
      fontSize: pxToRem(xs),
    },
    "@media (min-width:600px)": {
      fontSize: pxToRem(sm),
    },
    "@media (min-width:992px)": {
      fontSize: pxToRem(md),
    },
    "@media (min-width:1440px)": {
      fontSize: pxToRem(lg),
    },
    "@media (min-width:1920px)": {
      fontSize: pxToRem(xl),
    },
  };
}

const PRIMARY_FONT = "Inter";
// const SECONDARY_FONT = '';
const typography = {
  fontFamily: PRIMARY_FONT,

  h1: {
    fontSize: pxToRem(40),
    fontWeight: 900,
    fontFamily: "Inter-ExtraBold",
    ...responsiveFontSizes({ xs: 31, sm: 31, md: 34, lg: 37, xl: 40 }),
  },
  h2: {
    fontSize: pxToRem(32),
    fontWeight: 700,
    fontFamily: "Inter-Bold",
    ...responsiveFontSizes({ xs: 24, sm: 24, md: 26, lg: 28, xl: 30 }),
  },
  h3: {
    fontSize: pxToRem(28),
    fontWeight: 500,
    fontFamily: "Inter-Medium",
    ...responsiveFontSizes({ xs: 20, sm: 20, md: 22, lg: 24, xl: 26 }),
  },
  h4: {
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ xs: 18, sm: 18, md: 20, lg: 22, xl: 24 }),
  },
  h5: {
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ xs: 16, sm: 16, md: 17, lg: 18, xl: 20 }),
  },
  h6: {
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ xs: 14, sm: 14, md: 16, lg: 17, xl: 18 }),
  },
  subtitle1: {
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ xs: 14, sm: 14, md: 16, lg: 18, xl: 20 }),
  },
  subtitle2: {
    fontSize: pxToRem(18),
    fontWeight: 700,
    ...responsiveFontSizes({ xs: 12, sm: 12, md: 14, lg: 16, xl: 18 }),
  },
  body1: {
    fontSize: pxToRem(16),
    ...responsiveFontSizes({ xs: 12, sm: 12, md: 14, lg: 16, xl: 18 }),
  },
  body2: {
    fontSize: pxToRem(14),
    ...responsiveFontSizes({ xs: 8, sm: 8, md: 10, lg: 12, xl: 14 }),
  },
  caption: {
    fontSize: pxToRem(14),
    ...responsiveFontSizes({ xs: 6, sm: 6, md: 8, lg: 10, xl: 12 }),
  },
  overline: {
    lineHeight: 1.5,
    fontSize: pxToRem(8),
    ...responsiveFontSizes({ xs: 5, sm: 5, md: 6, lg: 7, xl: 8 }),
  },
  button: {
    fontSize: pxToRem(14),
    textTransform: "capitalize",
  },
};

export default typography;
