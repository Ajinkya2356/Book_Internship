import { Container } from "@mui/material";
import React, { useEffect } from "react";
import UserCard from "./UserCard";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const { isAuthenticated } = useSelector((state) => state.USER);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);
  return (
    <Container
      style={{
        padding: 20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <UserCard />
    </Container>
  );
};

export default Profile;
