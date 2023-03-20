import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeOptions } from "./themes/defaultTheme";
import LoginRegisterPage from "./scenes/LoginRegisterPage";
import HomePage from "./scenes/HomePage";
import TermsAndConditions from "scenes/TermsAndConditions";
import MatchesPage from "./scenes/MatchesPage";
import ChatPage from "scenes/ChatPage";
import ProfilePage from "scenes/ProfilePage";
import NotFound from "scenes/NotFoundPage";
import EndFightPage from "scenes/EndFightPage/EndFightPage";
import socket from "./socket";
import FightNotification from "components/FightNotification/FightNotification";
import { setNotification } from "redux/state";

function App() {
  const theme = createTheme(themeOptions);
  const isAuth = Boolean(useSelector((state) => state.token));
  const isChatUser = Boolean(useSelector((state) => state.chatUser));
  const navigate = useNavigate();

  // Redux
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  // State
  const [fightData, setFightData] = useState(null);
  const [showChooseWinner, setShowChooseWinner] = useState(false);
  const [fightSuccess, setFightSuccess] = useState(false);
  const [fightPunishment, setFightPunishment] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(null);

  // Web Socket
  socket.on("end fight", async (fightData) => {
    setFightData(fightData);
    dispatch(
      setNotification({
        notification: "end_fight",
      })
    );
    setShowChooseWinner(true);
  });

  socket.on("fight success", async (fightData) => {
    setFightData(fightData.fight);
    dispatch(
      setNotification({
        notification: "fight_success",
      })
    );
    setFightSuccess(true);
  });

  socket.on("fight punishment", async (fightData) => {
    setUpdatedUser(fightData.user);
    dispatch(
      setNotification({
        notification: "fight_punishment",
      })
    );
    setFightPunishment(true);
  });

  useEffect(() => {
    if (showChooseWinner || fightSuccess || fightPunishment) {
      navigate("/notification");
    }
  }, [showChooseWinner, fightSuccess, fightPunishment]);

  useEffect(() => {
    if (isAuth) {
      socket.connect();
    }

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("end fight");
      socket.off("fight success");
      socket.off("fight punishment");
    };
  }, []);

  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route
            path="/"
            element={isAuth ? <Navigate to="/home" /> : <LoginRegisterPage />}
          />
          <Route
            path="/home"
            element={isAuth ? <HomePage /> : <Navigate to="/" />}
          />
          <Route
            path="/matches"
            element={isAuth ? <MatchesPage /> : <Navigate to="/" />}
          />
          <Route
            path="/chat"
            element={isAuth ? <ChatPage /> : <Navigate to="/" />}
          />
          <Route
            path="/profile/:id"
            element={
              isAuth && isChatUser ? <ProfilePage /> : <Navigate to="/home" />
            }
          />
          <Route
            path="/end-fight"
            element={
              isAuth && isChatUser ? <EndFightPage /> : <Navigate to="/home" />
            }
          />
          <Route
            path="/notification"
            element={
              isAuth ? (
                <FightNotification
                  fightData={fightData}
                  userData={updatedUser}
                />
              ) : (
                <Navigate to="/home" />
              )
            }
          />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
