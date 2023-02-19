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

const BottomNav = () => {
  // Variables
  const theme = useTheme();

  // Redux
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.currentPage);

  // State
  const [value, setValue] = useState(() => {
    if (currentPage === "fight") {
      return 0;
    } else if (currentPage === "matches") {
      return 1;
    } else if (currentPage === "chat") {
      return 2;
    }
  });

  // Use Effect
  useEffect(() => {
    if (value === 0) {
      dispatch(
        setCurrentPage({
          currentPage: "fight",
        })
      );
      dispatch(
        setChatUser({
          chatUser: null,
        })
      );
    } else if (value === 1) {
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
    } else if (value === 2) {
      dispatch(
        setCurrentPage({
          currentPage: "chat",
        })
      );
    }
  }, [value]);

  useEffect(() => {
    if (currentPage === "fight") {
      setValue(0);
    } else if (currentPage === "matches") {
      setValue(1);
    } else if (currentPage === "chat") {
      setValue(2);
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
                sx={{ color: `${currentPage === "fight" ? "red" : "white"}` }}
              />
            }
          />
          <BottomNavigationAction
            label="Matches"
            icon={
              <GroupsIcon
                sx={{ color: `${currentPage === "matches" ? "red" : "white"}` }}
              />
            }
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default BottomNav;
