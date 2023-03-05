import React from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
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

function App() {
  const theme = createTheme(themeOptions);
  const isAuth = Boolean(useSelector((state) => state.token));
  const isChatUser = Boolean(useSelector((state) => state.chatUser));

  return (
    <div className="app">
      <BrowserRouter>
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
                isAuth && isChatUser ? (
                  <EndFightPage />
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
      </BrowserRouter>
    </div>
  );
}

export default App;
