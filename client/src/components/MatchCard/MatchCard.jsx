import React from "react";
import {
  useTheme,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useDispatch, useSelector } from "react-redux";
import { setChatUser, setCurrentPage } from "redux/state";
import { useNavigate } from "react-router-dom";

const MatchCard = ({ match, fetchMatches }) => {
  // Variables
  const theme = useTheme();
  const navigate = useNavigate();

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
    navigate("/chat");
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
};

export default MatchCard;
