import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  TextField,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const UserCard = () => {
  const { user, loading } = useSelector((state) => state.USER);
  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        border: "1px solid #444",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Avatar
            style={{
              height: "100px",
              width: "100px",
            }}
          />
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <TextField label="Email" value={user?.email} />
            <TextField label="Username" value={user?.username} />{" "}
          </Box>
        </>
      )}
    </Container>
  );
};

export default UserCard;
