import React, { useEffect } from "react";
import { Box, Typography, Button, useTheme, Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentPage, setLogout } from "redux/state";
import { HOME } from "../../pageConstants";
import socket from "../../socket";

const FightNotification = ({ fightData, userData }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Redux
  const notification = useSelector((state) => state.notification);
  const user = useSelector((state) => state.user);
  const chatUser = useSelector((state) => state.chatUser);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();

  // Helper Functions
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

  return (
    <>
      {notification === "end_fight" ? (
        <>
          <Box>
            <Typography>Winner: {fightData.winner.firstName}</Typography>
            <Typography>Loser: {fightData.loser.firstName}</Typography>
          </Box>
        </>
      ) : (
        <></>
      )}
      {notification === "fight_success" ? (
        <>
          {fightData.winner._id === user._id ? (
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
      ) : (
        <></>
      )}
      {notification === "fight_punishment" ? (
        <>
          {userData.strikes === 1 ? (
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
              {userData.isDeactivated && (
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
              {userData.isBanned && (
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
      ) : (
        <></>
      )}
    </>
  );
};

export default FightNotification;
