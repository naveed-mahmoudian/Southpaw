import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  List,
  Modal,
  Typography,
  useTheme,
} from "@mui/material";
import FightCard from "components/FightCard/FightCard";
import { MATCHES } from "pageConstants";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from "redux/state";

const FightContainer = () => {
  // Variables
  const theme = useTheme();

  // State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openMatchModal, setOpenMatchModal] = useState(false);
  const handleOpen = () => setOpenMatchModal(true);
  const handleClose = () => setOpenMatchModal(false);
  // Redux
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Helper Functions
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userResponse = await fetch(`/api/users/${user._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const userData = await userResponse.json();

      if (userData) {
        setUsers(userData);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleMatch = async () => {
    handleOpen();
  };

  // Use Effect
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Box>
        <Modal
          open={openMatchModal}
          aria-labelledby="match-modal-title"
          aria-describedby="match-modal-description"
          sx={{ textAlign: "center", backgroundColor: "black" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100svh",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              id="match-modal-title"
              variant="h6"
              component="h2"
              sx={{ marginBottom: "2rem" }}
            >
              It's a match!
            </Typography>
            <Button
              variant="large"
              sx={{
                border: `1px solid ${theme.palette.primary.main}`,
                backgroundColor: theme.palette.background.default,
                color: theme.palette.primary.main,
                "&:hover": { color: theme.palette.secondary.main },
                marginBottom: "1rem",
              }}
              onClick={() => dispatch(setCurrentPage({ currentPage: MATCHES }))}
            >
              See Your Matches
            </Button>
            <Button
              variant="small"
              sx={{
                border: `1px solid ${theme.palette.primary.main}`,
                backgroundColor: theme.palette.background.default,
                color: theme.palette.primary.main,
                "&:hover": { color: theme.palette.secondary.main },
              }}
              onClick={handleClose}
            >
              Back
            </Button>
          </Box>
        </Modal>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "86svh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {users.length === 0 ? (
              <Typography>No more fighters for now, come back soon!</Typography>
            ) : (
              users.map((user, index) => {
                return (
                  <FightCard
                    key={user._id}
                    user={user}
                    fetchUsers={fetchUsers}
                    handleMatch={handleMatch}
                    index={index}
                  />
                );
              })
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default FightContainer;
