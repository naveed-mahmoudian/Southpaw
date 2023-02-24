import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentPage, setLogin } from "../../redux/state";
import Dropzone from "react-dropzone";
import { HOME } from "pageConstants";
import GoogleMaps from "./GoogleMapsAutocomplete";

// Validation Schemas
const signupSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastInitial: yup.string().required("required"),
  nickname: yup.string().required("required"),
  bio: yup.string().required("required"),
  picture: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().min(6).max(22).required("required"),
  location: yup.string().required("required"),
  height: yup.string().required("required"),
  weight: yup.string().required("required"),
  DOB: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

// Initial Form Values
const initialValuesSignup = {
  firstName: "",
  lastInitial: "",
  nickname: "",
  bio: "",
  picture: "",
  email: "",
  password: "",
  location: "",
  height: "",
  weight: "",
  DOB: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  // Variables
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const navigate = useNavigate();

  // State
  const [pageType, setPageType] = useState("login");
  const isLogin = pageType === "login";
  const isSignup = pageType === "signup";
  const [termsAndConditions, setTermsAndConditions] = useState(false);

  // Redux
  const dispatch = useDispatch();

  // Handle Signup
  const signup = async (values, onSubmitProps) => {
    if (!termsAndConditions) return;

    const formData = new FormData();

    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch("/auth/signup", {
      method: "POST",
      body: formData,
    });

    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }
  };

  // Handle Login
  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();

    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
      dispatch(
        setCurrentPage({
          currentPage: HOME,
        })
      );
    }
  };

  // Handle Form Submit
  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isSignup) await signup(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesSignup}
      validationSchema={isLogin ? loginSchema : signupSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(6, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 6" },
            }}
          >
            {isSignup && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="firstName"
                  placeholder="John"
                  inputProps={{
                    style: { textTransform: "capitalize" },
                  }}
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Initial"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="lastInitial"
                  placeholder="D"
                  inputProps={{
                    maxLength: 1,
                    style: { textTransform: "capitalize" },
                  }}
                  error={
                    Boolean(touched.lastInitial) && Boolean(errors.lastInitial)
                  }
                  helperText={touched.lastInitial && errors.lastInitial}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Nickname"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="nickname"
                  error={Boolean(touched.nickname) && Boolean(errors.nickname)}
                  helperText={touched.nickname && errors.nickname}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Bio"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="bio"
                  placeholder="..."
                  multiline
                  maxRows={3}
                  error={Boolean(touched.bio) && Boolean(errors.bio)}
                  helperText={touched.bio && errors.bio}
                  sx={{ gridColumn: "span 6" }}
                />
                <Box
                  gridColumn="span 6"
                  border={`1px solid gray`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${theme.palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Choose Picture</p>
                        ) : (
                          <>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="location"
                  placeholder="City, State"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 6" }}
                />
                <GoogleMaps />
                <TextField
                  label="Height"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="height"
                  placeholder="6ft 2in"
                  error={Boolean(touched.height) && Boolean(errors.height)}
                  helperText={touched.height && errors.height}
                  sx={{ gridColumn: "span 3" }}
                />
                <TextField
                  label="Weight"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="weight"
                  placeholder="170lbs"
                  error={Boolean(touched.weight) && Boolean(errors.weight)}
                  helperText={touched.weight && errors.weight}
                  sx={{ gridColumn: "span 3" }}
                />
                <TextField
                  label="Date of Birth"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="DOB"
                  placeholder="MM/YYYY"
                  error={Boolean(touched.height) && Boolean(errors.height)}
                  helperText={touched.height && errors.height}
                  sx={{ gridColumn: "span 6" }}
                />
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              placeholder="example@email.com"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 3" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              placeholder="••••••"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 3" }}
            />
          </Box>

          {/* BUTTONS */}
          {isSignup ? (
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    value={true}
                    onChange={(e) => setTermsAndConditions(e.target.checked)}
                    sx={{
                      color: `${
                        termsAndConditions
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main
                      }`,
                    }}
                  />
                }
                sx={{ marginTop: "2rem" }}
                label="BY CHECKING THIS BOX AND CREATING AN ACCOUNT YOU ARE HERBY AGREEING TO OUR TERMS AND CONDITIONS. OUR TERMS AND CONDITIONS CAN BE FOUND AT THE LINK AT THE BOTTOM OF THIS PAGE."
              />
            </FormGroup>
          ) : (
            ""
          )}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: theme.palette.background.default,
                color: theme.palette.primary.main,
                border: `1px solid ${theme.palette.primary.main}`,
                "&:hover": { color: theme.palette.secondary.main },
              }}
            >
              {isLogin ? "LOGIN" : "SIGNUP"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "signup" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: theme.palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: theme.palette.secondary.main,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Signup here!"
                : "Already have an account? Login here!"}
            </Typography>
            <Typography
              onClick={() => navigate("/terms-and-conditions")}
              sx={{
                textDecoration: "underline",
                color: theme.palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: theme.palette.secondary.main,
                },
              }}
            >
              View our Terms and Conditions
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
