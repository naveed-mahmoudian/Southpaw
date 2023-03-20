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
import { setChatUser, setCurrentPage, setLogout } from "redux/state";
import { useNavigate } from "react-router-dom";
import { HOME, MATCHES, PROFILE } from "pageConstants";
import socket from "../../socket";

const ChatContainer = () => {
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
  const [showChooseWinner, setShowChooseWinner] = useState(false);
  const [fightId, setFightId] = useState(null);
  const [fightSuccess, setFightSuccess] = useState(false);
  const [fightPunishment, setFightPunishment] = useState(false);
  const [updatedFight, setUpdatedFight] = useState(null);
  const [updatedUser, setUpdatedUser] = useState(null);

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

  const handleGoHome = async () => {
    const removeChatRoomResponse = await fetch(
      `/api/users/${user._id}/actions/removeChatRoom`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: chatUser._id }),
      }
    );

    const removeChatRoomData = await removeChatRoomResponse.json();

    if (removeChatRoomData) {
      navigate("/home");

      dispatch(
        setCurrentPage({
          currentPage: HOME,
        })
      );

      dispatch(
        setChatUser({
          chatUser: null,
        })
      );
    }
  };

  const handleLeave = async () => {
    try {
      const removeChatRoomResponse = await fetch(
        `/api/users/${user._id}/actions/removeChatRoom`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: chatUser._id }),
        }
      );

      const removeChatRoomData = await removeChatRoomResponse.json();

      socket.disconnect();
      dispatch(setLogout());
    } catch (err) {
      console.error(err);
    }
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

  const handleChooseWinner = async (winner, loser) => {
    try {
      const compareFightResponse = await fetch(
        `/api/users/${user._id}/actions/compareFight`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fightId: fightId,
            winnerId: winner._id,
            loserId: loser._id,
          }),
        }
      );

      const compareFightData = await compareFightResponse.json();

      if (compareFightData.isMatch) {
        socket.emit("fight success", compareFightData);
      } else {
        socket.emit("fight punishment", compareFightData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Web Socket
  socket.on("private message", async (content) => {
    try {
      await fetchMessages();
    } catch (err) {
      console.error(err.message);
    }
  });

  // socket.on("end fight", async (fightData) => {
  //   setShowChooseWinner(true);
  //   setFightId(fightData._id);
  // });

  // socket.on("fight success", async (fightData) => {
  //   setUpdatedFight(fightData.fight);
  //   setFightSuccess(true);
  // });

  // socket.on("fight punishment", async (fightData) => {
  //   setUpdatedUser(fightData.user);
  //   setFightPunishment(true);
  // });

  // Use Effect
  useEffect(() => {
    socket.connect();

    socket.emit("join room", { fromUserId: user._id, toUserId: chatUser._id });

    async function getMessages() {
      await fetchMessages();
    }
    getMessages();

    return () => {
      socket.off("private message");
      socket.off("join room");
    };
  }, []);

  return (
    <>
      {fightSuccess && (
        <>
          {updatedFight.winner === user._id ? (
            <>
              <Typography>You Won!</Typography>
              <Button onClick={handleGoHome}>Back To Home</Button>
            </>
          ) : (
            <>
              <Typography>You Lost</Typography>
              <Button onClick={handleGoHome}>Back To Home</Button>
            </>
          )}
        </>
      )}
      {fightPunishment && (
        <>
          {updatedUser.strikes === 1 ? (
            <>
              <Typography>
                WARNING: Because you and your opponent's answers didn't match, 1
                strike has been added to your account. Next time it will be a
                temporary ban, followed by a permanent ban!
              </Typography>
              <Button onClick={handleGoHome}>Back To Home</Button>
            </>
          ) : (
            <>
              {updatedUser.isDeactivated && (
                <>
                  <Typography>
                    TEMPORARY BAN: Because you and your opponent's answers
                    didn't match for the second time, a second strike has been
                    added to your account and you have been temporarily banned.
                    Next time it will be a permanent ban!
                  </Typography>
                  <Button onClick={handleLeave}>Leave</Button>
                </>
              )}
              {updatedUser.isBanned && (
                <>
                  <Typography>
                    PERMANENT BAN: Because you and your opponent's answers
                    didn't match for the third time, a third strike has been
                    added to your account and you have been permanently banned.
                    Please consider growing up and stop ruining the sport.
                    Goodbye.
                  </Typography>
                  <Button onClick={handleLeave}>Leave</Button>
                </>
              )}
            </>
          )}
        </>
      )}
      {showChooseWinner ? (
        <>
          <Typography
            variant="h6"
            sx={{ marginY: "2rem", textAlign: "center" }}
          >
            Who won?
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "2rem",
              }}
            >
              <Button
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  border: `1px solid ${theme.palette.primary.main}`,
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.primary.main,
                  "&:hover": { color: theme.palette.secondary.main },
                  minWidth: "8rem",
                  maxWidth: "12rem",
                }}
                onClick={() => handleChooseWinner(user, chatUser)}
              >
                <Avatar
                  src={`http://localhost:3000/assets/${user.picturePath}`}
                ></Avatar>
                <Typography>
                  {user.firstName} {user.lastInitial}.
                </Typography>
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  border: `1px solid ${theme.palette.primary.main}`,
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.primary.main,
                  "&:hover": { color: theme.palette.secondary.main },
                  minWidth: "8rem",
                  maxWidth: "12rem",
                }}
                onClick={() => handleChooseWinner(chatUser, user)}
              >
                <Avatar
                  src={`http://localhost:3000/assets/${chatUser.picturePath}`}
                ></Avatar>
                <Typography>
                  {chatUser.firstName} {chatUser.lastInitial}.
                </Typography>
              </Button>
            </Box>
          </Box>
        </>
      ) : (
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
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2, p: "2rem" }}
              >
                WARNING: If you end the fight, both users must agree on an
                outcome within 24 hours!
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
      )}
    </>
  );
};

export default ChatContainer;
