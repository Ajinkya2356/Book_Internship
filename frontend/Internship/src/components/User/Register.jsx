import React, { useEffect, useState } from "react";
import { TextField, Button, Grid, Paper, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../Redux/user/userSlice";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.USER);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
    navigate("/");
  };
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/me");
    }
  }, [isAuthenticated]);
  return (
    <Grid container justifyContent="center" padding={10}>
      <Grid item xs={12} sm={8} md={6}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h5" gutterBottom>
            Register
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  variant="outlined"
                  value={formData.username}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  variant="outlined"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
            >
              Register
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Register;
