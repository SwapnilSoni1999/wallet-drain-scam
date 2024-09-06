import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

class SnapShot extends React.Component {
  render() {
    return (
      <Box>
        <Stack>
          <Stack flex={2}>
            <Stack flexDirection="row">
              <KeyboardBackspaceIcon />
              <Typography>Back</Typography>
            </Stack>
          </Stack>
          <Stack flex={1}></Stack>
        </Stack>
      </Box>
    );
  }
}

export default SnapShot;
