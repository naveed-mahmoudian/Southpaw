import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import BottomNav from "../../components/BottomNav/BottomNav";
import { useSelector } from "react-redux";
import MatchesContainer from "scenes/MatchesContainer";
import LogoutButton from "components/LogoutButton/LogoutButton";
import { MATCHES } from "pageConstants";

const MatchesPage = () => {
  const theme = useTheme();
  const user = useSelector((state) => state.user);
  const currentPage = useSelector((state) => state.currentPage);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
      }}
    >
      <LogoutButton />
      <Typography>Welcome, {user.firstName}</Typography>
      {currentPage === MATCHES ? <MatchesContainer /> : ""}
      <BottomNav />
    </Box>
  );
};

export default MatchesPage;
