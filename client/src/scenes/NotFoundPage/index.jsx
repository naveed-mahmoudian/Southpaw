import { Box, Button, Typography, useTheme } from "@mui/material";
import { HOME } from "pageConstants";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentPage } from "redux/state";

const NotFound = () => {
  // Variables
  const theme = useTheme();
  const navigate = useNavigate();

  // Redux
  const dispatch = useDispatch();

  // Helper Functions
  const handleGoHome = () => {
    navigate("/home");
    dispatch(
      setCurrentPage({
        currentPage: HOME,
      })
    );
  };

  return (
    <Box
      sx={{
        height: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: "1rem",
      }}
    >
      <Typography variant="h3" sx={{ mb: "1rem" }}>
        404 - Not Found
      </Typography>
      <Typography variant="h6" sx={{ mb: "2rem" }}>
        The page you requested cannot be found.
      </Typography>
      <Button
        fullWidth
        sx={{
          border: `1px solid ${theme.palette.primary.main}`,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.primary.main,
          "&:hover": { color: theme.palette.secondary.main },
        }}
        onClick={handleGoHome}
      >
        Go Home
      </Button>
    </Box>
  );
};

export default NotFound;
