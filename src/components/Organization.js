import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import Menu from "./Menu";
import { fetchAllUsers } from "../services/userService";

const headerStyles = {
  backgroundColor: "#1976d2",
  color: "white",
};

const Organization = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchAllUsers();
        console.log("data", data);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUsers();
  }, []);

  return (
    <Container component="main">
      <Menu />{" "}
      <Box sx={{ mt: 15 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Organization
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={headerStyles}>S.No</TableCell>
                <TableCell sx={headerStyles}>Name</TableCell>
                <TableCell sx={headerStyles}>Role</TableCell>
                <TableCell sx={headerStyles}>Email Id</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Organization;
