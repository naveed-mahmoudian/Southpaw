import React from "react";
import { useTheme, useMediaQuery, Box, Typography } from "@mui/material";
import MasonryImageList from "../../components/MasonryImageList/MasonryImageList";
import Form from "./Form";

const LoginRegisterPage = () => {
  const theme = useTheme();
  const isNonMobileScreen = useMediaQuery("(min-width: 1000px)");

  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.default}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          Southpaw
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreen ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.default}
      >
        <Typography
          fontWeight="500"
          variant="h5"
          sx={{ mb: "1.5rem", textAlign: "center" }}
        >
          MEET - FIGHT - RESPECT
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginRegisterPage;
