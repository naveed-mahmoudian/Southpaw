import React from "react";
import {
  useTheme,
  Paper,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ClearIcon from "@mui/icons-material/Clear";
import { useDispatch, useSelector } from "react-redux";
import { setChatUser, setCurrentPage } from "redux/state";

const MatchCard = ({ match, fetchMatches }) => {
  // Variables
  const theme = useTheme();

  // Redux
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const currentPage = useSelector((state) => state.currentPage);
  const dispatch = useDispatch();

  // Helper Functions
  const handleRemoveMatch = async () => {
    try {
      const removeMatchResponse = await fetch(
        `/api/users/${user._id}/actions/removeMatch`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: match._id }),
        }
      );

      const removeMatchData = await removeMatchResponse.json();

      if (removeMatchData) {
        fetchMatches();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChat = () => {
    dispatch(
      setCurrentPage({
        currentPage: "chat",
      })
    );

    dispatch(
      setChatUser({
        chatUser: match,
      })
    );
  };

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: `${theme.palette.background.paper}`,
      }}
    >
      <ListItem alignItems="flex-start" onClick={handleChat}>
        <ListItemAvatar>
          <Avatar
            alt={`${match.firstName} ${match.lastName}`}
            src={`http://localhost:3001/assets/${match.picturePath}`}
          />
        </ListItemAvatar>
        <ListItemText
          primary={`${match.firstName} ${match.lastInitial}.`}
          secondary={
            <React.Fragment>
              {"I'll be in your neighborhood doing errands, and this…"}
            </React.Fragment>
          }
        />
        <Button
          sx={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.primary.main,
            "&:hover": { color: theme.palette.secondary.main },
            m: "0.5rem",
          }}
          onClick={(event) => {
            event.stopPropagation();
            return handleRemoveMatch();
          }}
        >
          <ClearIcon />
        </Button>
      </ListItem>
      <Divider variant="middle" component="li" />
    </List>
  );

  //   return (
  //     <Paper
  //       variant="outlined"
  //       sx={{
  //         display: "flex",
  //         justifyContent: "space-between",
  //         alignItems: "center",
  //         marginBottom: "1rem",
  //       }}
  //     >
  //       <Typography sx={{ m: "0.5rem" }}>
  //         {match.firstName} {match.lastInitial}.
  //       </Typography>
  //       <Box>
  //         <Button
  //           sx={{
  //             border: `1px solid ${theme.palette.primary.main}`,
  //             backgroundColor: theme.palette.background.default,
  //             color: theme.palette.primary.main,
  //             "&:hover": { color: theme.palette.secondary.main },
  //             m: "0.5rem",
  //           }}
  //           onClick={handleChat}
  //         >
  //           <ChatIcon />
  //         </Button>
  //         <Button
  //           sx={{
  //             border: `1px solid ${theme.palette.primary.main}`,
  //             backgroundColor: theme.palette.background.default,
  //             color: theme.palette.primary.main,
  //             "&:hover": { color: theme.palette.secondary.main },
  //             m: "0.5rem",
  //           }}
  //           onClick={handleRemoveMatch}
  //         >
  //           <DeleteForeverIcon />
  //         </Button>
  //       </Box>
  //     </Paper>
  //   );
};

export default MatchCard;
