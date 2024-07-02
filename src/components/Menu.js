import React, { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(navigate);
  };

  return (
    <AppBar>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          CURD Application
        </Typography>
        {user.role === "organizer" && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button component={RouterLink} to="/dashboard" color="inherit">
              Dashboard
            </Button>
            <Button component={RouterLink} to="/organization" color="inherit">
              Organizations
            </Button>
            <Button onClick={handleLogout} color="inherit">
              Logout
            </Button>
          </Box>
        )}
        {user.role === "user" && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button component={RouterLink} to="/dashboard" color="inherit">
              Dashboard
            </Button>
            <Button onClick={handleLogout} color="inherit">
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
