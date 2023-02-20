import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import BottomNav from "../../components/BottomNav/BottomNav";
import { useSelector } from "react-redux";
import ProfileContainer from "scenes/ProfileContainer";
import LogoutButton from "components/LogoutButton/LogoutButton";
import { PROFILE } from "pageConstants";

const ProfilePage = () => {
  const theme = useTheme();
  const user = useSelector((state) => state.user);
  const currentPage = useSelector((state) => state.currentPage);

  return (
    <Box>
      <LogoutButton />
      <Typography>Welcome, {user.firstName}</Typography>
      {currentPage === PROFILE ? <ProfileContainer /> : ""}
      <BottomNav />
    </Box>
  );
};

export default ProfilePage;
