import React, { useEffect, useState } from "react";
import {
  useTheme,
  Box,
  Typography,
  TextField,
  Avatar,
  Paper,
  FormControl,
  Input,
  InputAdornment,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import { setChatUser, setCurrentPage } from "redux/state";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const ChatContainer = () => {
  // Variables
  const theme = useTheme();
  const navigate = useNavigate();

  // Redux
  const chatUser = useSelector((state) => state.chatUser);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // State
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");

  // Helper Functions
  const handleGoBack = () => {
    navigate("/home");

    dispatch(
      setCurrentPage({
        currentPage: "matches",
      })
    );

    dispatch(
      setChatUser({
        chatUser: null,
      })
    );
  };

  const handleSendMessage = () => {
    socket.emit("send_message", {
      sender: user._id,
      receiver: chatUser._id,
      message: message,
    });
  };

  const handleProfile = () => {
    navigate(`/profile/${chatUser._id}`);

    dispatch(
      setCurrentPage({
        currentPage: "profile",
      })
    );
  };

  // Use Effect
  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      path: "/api/chat",
    });
    setSocket(newSocket);
    console.log(newSocket);

    return () => newSocket.disconnect();
  }, []);

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "86svh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          p: "1rem",
        }}
      >
        <ArrowBackIosNewIcon onClick={handleGoBack} />
        <Typography>
          {chatUser.firstName} {chatUser.lastInitial}.
        </Typography>
        <Avatar
          alt={`${chatUser.firstName} ${chatUser.lastInitial}`}
          src={`http://localhost:3001/assets/${chatUser.picturePath}`}
          onClick={handleProfile}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          p: "1rem",
        }}
      >
        <TextField
          fullWidth
          multiline
          rows={20}
          variant="filled"
          disabled
          value={"Messages"}
        ></TextField>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          p: "1rem",
        }}
      >
        <FormControl variant="standard" fullWidth>
          <Input
            fullWidth
            multiline
            maxRows={4}
            placeholder="..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <SendIcon onClick={handleSendMessage} />
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>
    </Paper>
  );
};

export default ChatContainer;
