import React, { useEffect, useState } from "react";
import {
  useTheme,
  Box,
  Typography,
  Modal,
  Avatar,
  Paper,
  FormControl,
  Input,
  InputAdornment,
  List,
  ListItem,
  Button,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SendIcon from "@mui/icons-material/Send";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
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
  const [openEndFightModal, setOpenEndFightModal] = useState(false);
  const handleOpenEndFightModal = () => setOpenEndFightModal(true);
  const handleCloseEndFightModal = () => setOpenEndFightModal(false);

  // Helper Functions
  const handleGoBack = () => {
    navigate("/home");

    // socket.disconnect();

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

  // Web Socket
  socket.on("private message", async (content) => {
    try {
      await fetchMessages();
    } catch (err) {
      console.error(err.message);
    }
  });

  // Use Effect
  useEffect(() => {
    // socket.connect();

    socket.emit("join room", { fromUserId: user._id, toUserId: chatUser._id });

    async function getMessages() {
      await fetchMessages();
    }
    getMessages();
  }, []);

  return (
    <>
      <Modal
        open={openEndFightModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          backgroundColor: `${theme.palette.background.default}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100vw",
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: "center" }}
          >
            END FIGHT
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, p: "2rem" }}>
            WARNING: If you end the fight, both users must agree on an outcome
            within 24 hours!
          </Typography>
          <Button
            sx={{
              border: `1px solid ${theme.palette.primary.main}`,
              backgroundColor: theme.palette.background.default,
              color: theme.palette.primary.main,
              "&:hover": { color: theme.palette.secondary.main },
              p: "1rem",
              marginBottom: "1rem",
            }}
            onClick={() => navigate("/end-fight")}
          >
            End Fight
          </Button>
          <Button
            sx={{
              border: `1px solid ${theme.palette.primary.main}`,
              backgroundColor: theme.palette.background.default,
              color: theme.palette.primary.main,
              "&:hover": { color: theme.palette.secondary.main },
            }}
            onClick={handleCloseEndFightModal}
          >
            Go Back
          </Button>
        </Box>
      </Modal>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "92svh",
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
        <List
          sx={{
            overflowY: "scroll",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {messages.length > 0 ? (
            messages.map((message) => (
              <ListItem key={message._id}>{message.message}</ListItem>
            ))
          ) : (
            <Typography>No messages</Typography>
          )}
        </List>
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
                  <SendIcon
                    sx={{
                      marginRight: "1rem",
                      "&:hover": {
                        color: theme.palette.secondary.main,
                        cursor: "pointer",
                      },
                    }}
                    onClick={handleSendMessage}
                  />
                  <EmojiEventsIcon
                    sx={{
                      "&:hover": {
                        color: theme.palette.secondary.main,
                        cursor: "pointer",
                      },
                    }}
                    onClick={handleOpenEndFightModal}
                  />
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
      </Paper>
    </>
  );
};

export default ChatContainer;
