import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import LogoutButton from "components/LogoutButton/LogoutButton";
import ChatContainer from "scenes/ChatContainer";
import { CHAT } from "pageConstants";

const ChatPage = () => {
  // const theme = useTheme();
  const user = useSelector((state) => state.user);
  const currentPage = useSelector((state) => state.currentPage);
  // const chatUser = useSelector((state) => state.chatUser);

  return (
    <Box>
      <LogoutButton />
      <Typography>Welcome, {user.firstName}</Typography>
      {currentPage === CHAT ? <ChatContainer /> : ""}
    </Box>
  );
};

export default ChatPage;
