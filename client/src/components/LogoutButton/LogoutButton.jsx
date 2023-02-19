import React from "react";
import { Button, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { setLogout } from "redux/state";

const LogoutButton = () => {
  // Variables
  const theme = useTheme();

  // Redux
  const dispatch = useDispatch();

  // Helper Functions
  const handleLogout = () => {
    dispatch(setLogout());
  };

  return (
    <Button
      sx={{
        border: `1px solid ${theme.palette.primary.main}`,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.primary.main,
        "&:hover": { color: theme.palette.secondary.main },
      }}
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
