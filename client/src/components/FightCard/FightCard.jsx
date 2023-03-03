import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  useTheme,
  Avatar,
} from "@mui/material";
import SportsMmaIcon from "@mui/icons-material/SportsMma";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from "react-redux";

const FightCard = ({ user, fetchUsers, handleMatch, index }) => {
  // Variables
  const theme = useTheme();

  // Redux
  const currentUser = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  // Helper Functions
  const handleFight = async () => {
    try {
      const fightResponse = await fetch(
        `/api/users/${currentUser._id}/actions/fight`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user._id }),
        }
      );

      const fightData = await fightResponse.json();

      if (fightData.isMatch) {
        handleMatch();
      }

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePass = async () => {
    try {
      const passResponse = await fetch(
        `/api/users/${currentUser._id}/actions/pass`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user._id }),
        }
      );

      const passData = await passResponse.json();

      if (passData) {
        console.log(passData);
      }

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        textAlign: "center",
        p: "1rem",
        width: "18rem",
        height: "30rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar
        alt={`${user.firstName} ${user.lastInitial}`}
        src={`http://localhost:3001/assets/${user.picturePath}`}
        sx={{
          height: "8rem",
          width: "8rem",
        }}
      />
      <br></br>
      <Typography>
        {user.firstName} {user.lastInitial}.
      </Typography>
      <Typography sx={{ fontStyle: "italic" }}>{user.nickname}</Typography>
      <Typography>{user.location}</Typography>
      <br></br>
      <Typography>
        {user.height} - {user.weight}
      </Typography>
      <br></br>
      <Typography>
        {user.wins}W - {user.losses}L
      </Typography>
      <br></br>
      <Typography>{user.bio}</Typography>
      <br></br>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          p: "1rem",
        }}
      >
        <Button
          sx={{
            border: `1px solid ${theme.palette.primary.main}`,
            backgroundColor: theme.palette.background.default,
            color: theme.palette.primary.main,
            "&:hover": { color: theme.palette.secondary.main },
            marginRight: "6rem",
          }}
          onClick={handleFight}
        >
          <SportsMmaIcon />
        </Button>
        <Button
          sx={{
            border: `1px solid ${theme.palette.primary.main}`,
            backgroundColor: theme.palette.background.default,
            color: theme.palette.primary.main,
            "&:hover": { color: theme.palette.secondary.main },
          }}
          onClick={handlePass}
        >
          <ClearIcon />
        </Button>
      </Box>
    </Paper>
  );
};

export default FightCard;
