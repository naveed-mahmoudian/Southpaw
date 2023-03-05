import React from "react";
import { Box, List, Typography, useTheme } from "@mui/material";
import BottomNav from "../../components/BottomNav/BottomNav";
import { useSelector } from "react-redux";
import FightContainer from "scenes/FightContainer";
import LogoutButton from "components/LogoutButton/LogoutButton";
import { HOME } from "pageConstants";

const HomePage = () => {
  const theme = useTheme();
  const user = useSelector((state) => state.user);
  const currentPage = useSelector((state) => state.currentPage);

  return (
    <>
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
      </Box>
      <List sx={{ overflow: "scroll", height: "86vh" }}>
        {currentPage === HOME ? <FightContainer /> : ""}
      </List>
      <BottomNav />
    </>
  );
};

export default HomePage;
