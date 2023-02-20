import React, { useEffect, useState } from "react";
import {
  useTheme,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import SportsMmaIcon from "@mui/icons-material/SportsMma";
import GroupsIcon from "@mui/icons-material/Groups";
import { useDispatch, useSelector } from "react-redux";
import { setChatUser, setCurrentPage } from "../../redux/state";
import { useNavigate } from "react-router-dom";
import { HOME, MATCHES, CHAT, PROFILE } from "../../pageConstants";

const BottomNav = () => {
  // Variables
  const theme = useTheme();
  const navigate = useNavigate();

  // Redux
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.currentPage);

  // State
  const [value, setValue] = useState(() => {
    if (currentPage === HOME) {
      return 0;
    } else if (currentPage === MATCHES) {
      return 1;
    } else if (currentPage === CHAT) {
      return 2;
    } else if (currentPage === PROFILE) {
      return 3;
    }
  });

  // Use Effect
  useEffect(() => {
    if (value === 0) {
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
    } else if (value === 1) {
      navigate("/matches");
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
    } else if (value === 2) {
      navigate("/chat");
      dispatch(
        setCurrentPage({
          currentPage: CHAT,
        })
      );
    } else if (value === 2) {
      navigate("/profile");
      dispatch(
        setCurrentPage({
          currentPage: PROFILE,
        })
      );
    }
  }, [value]);

  useEffect(() => {
    if (currentPage === HOME) {
      setValue(0);
    } else if (currentPage === MATCHES) {
      setValue(1);
    } else if (currentPage === CHAT) {
      setValue(2);
    } else if (currentPage === PROFILE) {
      setValue(3);
    }
  }, [currentPage]);

  return (
    <Box sx={{ pb: 7 }}>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          // sx={{
          //   "& .Mui-selected": {
          //     "& .MuiBottomNavigationAction-label": {
          //       color: `${theme.palette.secondary.main}`,
          //     },
          //     "& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label": {
          //       color: `${theme.palette.secondary.main}`,
          //     },
          //   },
          // }}
        >
          <BottomNavigationAction
            label="Fight"
            icon={
              <SportsMmaIcon
                sx={{ color: `${currentPage === HOME ? "red" : "white"}` }}
              />
            }
          />
          <BottomNavigationAction
            label="Matches"
            icon={
              <GroupsIcon
                sx={{ color: `${currentPage === MATCHES ? "red" : "white"}` }}
              />
            }
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default BottomNav;
