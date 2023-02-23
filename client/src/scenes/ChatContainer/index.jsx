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
import { useNavigate } from "react-router-dom";
import { MATCHES, PROFILE } from "pageConstants";

const ChatContainer = ({ socket }) => {
  // Variables
  const theme = useTheme();
  const navigate = useNavigate();

  // Redux
  const chatUser = useSelector((state) => state.chatUser);
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();

  // State
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Helper Functions
  const handleGoBack = () => {
    navigate("/home");

    socket.disconnect();

    dispatch(
      setCurrentPage({
        currentPage: MATCHES,
      })
    );

    dispatch(
      setChatUser({
        chatUser: null,
      })
    );
  };

  const handleSendMessage = async () => {
    socket.emit("private message", {
      message: message,
      fromUser: user,
      toUser: chatUser,
    });
    try {
      const sendMessageResponse = await fetch(
        `/api/users/${user._id}/actions/sendMessage`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: chatUser._id, message: message }),
        }
      );
      const sendMessageData = await sendMessageResponse.json();
      if (sendMessageData.messageSent) {
        await fetchMessages();
      } else {
        console.error("Unable to send message");
      }
    } catch (err) {
      console.error(err.message);
    }
    setMessage("");
  };

  const fetchMessages = async () => {
    try {
      const messagesResponse = await fetch(
        `/api/users/${user._id}/${chatUser._id}/messages`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const messagesData = await messagesResponse.json();
      setMessages(messagesData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleProfile = () => {
    navigate(`/profile/${chatUser._id}`);

    dispatch(
      setCurrentPage({
        currentPage: PROFILE,
      })
    );
  };

  socket.on("private message", async (content) => {
    try {
      await fetchMessages();
    } catch (err) {
      console.error(err.message);
    }
  });

  // Use Effect
  useEffect(() => {
    socket.connect();

    socket.emit("join room", { fromUserId: user._id, toUserId: chatUser._id });

    async function getMessages() {
      await fetchMessages();
    }
    getMessages();
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
        <Typography onClick={handleProfile}>
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
        {messages.length > 0 ? (
          messages.map((message) => (
            <Typography key={message._id}>{message.message}</Typography>
          ))
        ) : (
          <Typography>No messages</Typography>
        )}
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
