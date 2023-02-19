import React from "react";
import {
  useTheme,
  Box,
  Typography,
  TextField,
  Avatar,
  Paper,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import { setChatUser, setCurrentPage } from "redux/state";

const ChatContainer = () => {
  // Variables
  const theme = useTheme();

  // Redux
  const chatUser = useSelector((state) => state.chatUser);
  const dispatch = useDispatch();

  // Helper Functions
  const handleGoBack = () => {
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
  };

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "86svh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          p: "1rem",
        }}
      >
        <ArrowBackIosNewIcon onClick={handleGoBack} />
        <Typography>
          {chatUser.firstName} {chatUser.lastInitial}.
        </Typography>
        <Avatar
          alt={`${chatUser.firstName} ${chatUser.lastInitial}`}
          src={`http://localhost:3001/assets/${chatUser.picturePath}`}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          p: "1rem",
        }}
      >
        <TextField
          fullWidth
          multiline
          rows={20}
          variant="filled"
          disabled
          value={"Messages"}
        ></TextField>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          p: "1rem",
        }}
      >
        <FormControl variant="standard" fullWidth>
          <Input
            fullWidth
            multiline
            maxRows={4}
            placeholder="..."
            endAdornment={
              <InputAdornment position="end">
                <SendIcon />
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>
    </Paper>
  );
};

export default ChatContainer;
