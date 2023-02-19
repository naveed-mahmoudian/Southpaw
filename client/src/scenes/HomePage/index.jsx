import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import BottomNav from "../../components/BottomNav/BottomNav";
import { useSelector } from "react-redux";
import FightContainer from "scenes/FightContainer";
import MatchesContainer from "scenes/MatchesContainer";
import LogoutButton from "components/LogoutButton/LogoutButton";
import ChatContainer from "scenes/ChatContainer";

const HomePage = () => {
  const theme = useTheme();
  const user = useSelector((state) => state.user);
  const currentPage = useSelector((state) => state.currentPage);

  return (
    <Box>
      <LogoutButton />
      <Typography>Welcome, {user.firstName}</Typography>
      {currentPage === "fight" ? <FightContainer /> : ""}
      {currentPage === "matches" ? <MatchesContainer /> : ""}
      {currentPage === "chat" ? <ChatContainer /> : ""}
      <BottomNav />
    </Box>
  );
};

export default HomePage;
