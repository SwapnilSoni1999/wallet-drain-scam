import React from "react";
import { Box, Typography, Stack, Link, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

class Footer extends React.Component {
  render() {
    return (
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          zIndex: 1400,
          bgcolor: this.props.theme.palette.background.neutral,
          width: "100%",
          py: 1,
          px: this.props.matchUpMd ? 30 : 2,
          borderTop: `1px solid ${this.props.theme.palette.divider}`,
        }}
      >
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant="caption"
            sx={{ color: this.props.theme.palette.text.disabled }}
          >
            @ 2024 Vegan Rob's
          </Typography>
          <Link
            href="https://veganrobs.com"
            target="_blank"
            sx={{ textDecoration: "none", display: "flex" }}
          >
            <Typography
              variant="caption"
              sx={{
                color: this.props.theme.palette.text.disabled,
              }}
            >
              veganrobs.com
            </Typography>
          </Link>
          <Link
            href="https://veganrobstoken.com"
            target="_blank"
            sx={{ textDecoration: "none", display: "flex" }}
          >
            <Typography
              variant="caption"
              sx={{
                color: this.props.theme.palette.text.disabled,
              }}
            >
              veganrobstoken.com
            </Typography>
          </Link>
        </Stack>
      </Box>
    );
  }
}

const withHook = (Component) => {
  return (props) => {
    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));
    return <Component theme={theme} matchUpMd={matchUpMd} {...props} />;
  };
};
export default withHook(Footer);
