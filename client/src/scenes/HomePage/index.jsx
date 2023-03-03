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
      <LogoutButton />
      <Typography>Welcome, {user.firstName}</Typography>
      <List sx={{ overflow: "scroll", maxHeight: "86svh" }}>
        {currentPage === HOME ? <FightContainer /> : ""}
      </List>
      <BottomNav />
    </>
  );
};

export default HomePage;
