import { Avatar, Box, Button, Typography, useTheme } from "@mui/material";
import { HOME } from "pageConstants";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentPage } from "redux/state";
import socket from "../../socket";

const EndFightPage = () => {
  // Variables
  const theme = useTheme();
  const navigate = useNavigate();

  // Redux
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const chatUser = useSelector((state) => state.chatUser);
  const dispatch = useDispatch();

  // Helper Functions
  const handleEndFight = async (winner, loser) => {
    try {
      const fightResponse = await fetch("/api/users/actions/endFight", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ winnerId: winner._id, loserId: loser._id }),
      });

      const fightData = await fightResponse.json();

      if (fightData) {
        socket.emit("end fight", fightData);
      }

      dispatch(
        setCurrentPage({
          currentPage: HOME,
        })
      );

      navigate("/home");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: "2rem" }}>
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
            onClick={() => handleEndFight(user, chatUser)}
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
            onClick={() => handleEndFight(chatUser, user)}
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
      <Button
        sx={{
          marginTop: "4rem",
          border: `1px solid ${theme.palette.primary.main}`,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.primary.main,
          "&:hover": { color: theme.palette.secondary.main },
        }}
        onClick={() => navigate("/chat")}
      >
        Cancel
      </Button>
    </Box>
  );
};

export default EndFightPage;
