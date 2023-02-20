import {
  Box,
  Button,
  Paper,
  Typography,
  useTheme,
  Avatar,
} from "@mui/material";
import { CHAT } from "pageConstants";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setCurrentPage } from "redux/state";

const ProfileContainer = () => {
  // Variables
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();

  // Redux
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();

  // State
  const [profile, setProfile] = useState(null);

  // Helper Functions
  const fetchProfile = async () => {
    try {
      const profileResponse = await fetch(`/api/user/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const profileData = await profileResponse.json();
      setProfile(profileData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoBack = () => {
    navigate("/chat");

    dispatch(
      setCurrentPage({
        currentPage: CHAT,
      })
    );
  };

  // Use Effect
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          textAlign: "center",
          p: "1rem",
          minWidth: "18rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: "4rem",
        }}
      >
        {profile && (
          <>
            <Avatar
              alt={`${profile.firstName} ${profile.lastInitial}`}
              src={`http://localhost:3001/assets/${profile.picturePath}`}
              sx={{
                height: "10rem",
                width: "10rem",
              }}
            />
            <br></br>
            <Typography>
              {profile.firstName} {profile.lastInitial}.
            </Typography>
            <Typography sx={{ fontStyle: "italic" }}>
              {profile.nickname}
            </Typography>
            <Typography>{profile.location}</Typography>
            <br></br>
            <Typography>
              {profile.height} - {profile.weight}
            </Typography>
            <br></br>
            <Typography>
              {profile.wins}W - {profile.losses}L
            </Typography>
            <br></br>
            <Typography>{profile.bio}</Typography>
            <br></br>
          </>
        )}
      </Paper>
      <Button
        fullWidth
        sx={{
          border: `1px solid ${theme.palette.primary.main}`,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.primary.main,
          "&:hover": { color: theme.palette.secondary.main },
        }}
        onClick={handleGoBack}
      >
        Back
      </Button>
    </>
  );
};

export default ProfileContainer;
