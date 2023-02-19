import { Box, Button, Modal, Typography, useTheme } from "@mui/material";
import FightCard from "components/FightCard/FightCard";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from "redux/state";

const FightContainer = () => {
  // Variables
  const theme = useTheme();

  // State
  const [users, setUsers] = useState([]);
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
      }
    } catch (err) {
      console.error(err);
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
          <Box>
            <Typography id="match-modal-title" variant="h6" component="h2">
              It's a match!
            </Typography>
            <Button
              variant="large"
              sx={{
                border: `1px solid ${theme.palette.primary.main}`,
                backgroundColor: theme.palette.background.default,
                color: theme.palette.primary.main,
                "&:hover": { color: theme.palette.secondary.main },
              }}
              onClick={() =>
                dispatch(setCurrentPage({ currentPage: "matches" }))
              }
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
        {users.length === 0 ? (
          <Typography>No more fighters for now, come back soon!</Typography>
        ) : (
          users.map((user) => {
            return (
              <FightCard
                key={user._id}
                user={user}
                fetchUsers={fetchUsers}
                handleMatch={handleMatch}
              />
            );
          })
        )}
      </Box>
    </>
  );
};

export default FightContainer;
