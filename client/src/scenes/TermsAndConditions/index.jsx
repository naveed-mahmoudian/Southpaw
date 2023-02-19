import { Button, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Box sx={{ textAlign: "center", paddingX: "2rem", paddingY: "2rem" }}>
      <Typography variant="h5">Welcome to Southpaw!</Typography>
      <br></br>
      <h3>
        By downloading and/or using our app, you agree to the following terms
        and conditions:
      </h3>
      <br></br>
      <br></br> 1. Southpaw is intended for entertainment purposes only. It is a
      joke app and should not be used to actually fight people. <br></br>
      <br></br>2. Users of Southpaw must be 18 years or older. By using this
      app, you confirm that you are 18 years of age or older. <br></br>
      <br></br>3. By using Southpaw, you acknowledge and accept that the app
      allows you to view other users in your area and decide to fight or pass on
      each user. If you choose to fight another user and the other user also
      chooses to fight you, you will be matched against each other. Southpaw is
      not responsible for any actions taken by users outside of the app.{" "}
      <br></br>
      <br></br>
      4. You agree to use Southpaw responsibly and not to engage in any illegal
      or harmful activities while using the app.
      <br></br>
      <br></br>5. Southpaw is not responsible for any damages or injuries that
      may occur as a result of using the app or participating in any fights or
      physical altercations that may arise from using the app. <br></br>
      <br></br>6. We reserve the right to suspend or terminate your account if
      we suspect that you are using the app in violation of these terms and
      conditions or for any other reason at our sole discretion. <br></br>
      <br></br>7. By using Southpaw, you agree to receive notifications,
      updates, and other communications from the app. You can opt-out of these
      communications at any time by going to your profile page and clicking on
      delete account. <br></br>
      <br></br>8. Southpaw may collect and use your personal information in
      accordance with our Privacy Policy. By using the app, you agree to the
      collection, use, and sharing of your personal information as described in
      our Privacy Policy. <br></br>
      <br></br>
      <h3>
        Thank you for using Southpaw! Have fun, stay safe, and remember to
        always fight fair!
      </h3>
      <br></br>
      <br></br>
      <Button
        onClick={() => navigate("/")}
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.primary.main,
          border: `1px solid ${theme.palette.primary.main}`,
          "&:hover": { color: theme.palette.secondary.main },
        }}
      >
        Back to home
      </Button>
    </Box>
  );
};

export default TermsAndConditions;
