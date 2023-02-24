import {
  useTheme,
  Box,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import MatchCard from "components/MatchCard/MatchCard";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MatchesContainer = () => {
  // Variables
  const theme = useTheme();

  // State
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  // Redux
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);

  // Helper Functions
  const fetchMatches = async () => {
    try {
      setLoading(true);
      const matchesResponse = await fetch(`/api/users/${user._id}/matches`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const matchesData = await matchesResponse.json();

      if (matchesData) {
        setMatches(matchesData);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Use Effect
  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
        Your Matches
      </Typography>
      <Divider />
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
          {matches.length === 0 ? (
            <Typography>No matches</Typography>
          ) : (
            matches.map((match) => {
              return (
                <MatchCard
                  key={match._id}
                  match={match}
                  fetchMatches={fetchMatches}
                />
              );
            })
          )}
        </>
      )}
    </Box>
  );
};

export default MatchesContainer;
