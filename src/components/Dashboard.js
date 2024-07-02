import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import Menu from "./Menu";
import { getCurrentUser } from "../services/userService";
import {
  addCustomer,
  deleteCustomer,
  getCustomersByOrganizer,
  getCustomersList,
  updateCustomer,
} from "../services/customerService";
import { formatDate } from "../utils/common";
import * as yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Validation schema
const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^[0-9]+$/, "Phone must be a number"),
  dateOfBirth: yup.date().required("Date of Birth is required"),
  gender: yup.string().required("Gender is required"),
  city: yup.string().required("City is required"),
});
const headerStyles = {
  backgroundColor: "#1976d2",
  color: "white",
};

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    city: "",
    organizer: null,
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await getCustomersList();
      setCustomers(response);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchCustomersByOrganizerId = async (id) => {
    try {
      const response = await getCustomersByOrganizer(id);
      setCustomers(response);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await getCurrentUser();
      setCurrentUser(response);
      const currentUser = response;
      if (currentUser.role == "user") {
        fetchCustomersByOrganizerId(response._id);
      } else {
        fetchCustomers();
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      // Validate form values
      await validationSchema.validate(formValues, { abortEarly: false });

      if (formValues._id) {
        formValues.organizer = currentUser._id;
        formValues.dateOfBirth = formatDate(formValues.dateOfBirth);
        // Update customer
        await updateCustomer(formValues._id, formValues);
        toast.success("Customer updated successfully");
      } else {
        formValues.organizer = currentUser._id;
        // Add new customer
        await addCustomer(formValues);
        toast.success("Customer added successfully");
      }

      fetchCurrentUser();
      handleCloseDialog();
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setFormErrors(validationErrors);
      } else {
        console.error("Error submitting customer:", error);
        toast.error("Error submitting customer");
      }
    }
  };

  const handleOpenDialog = (customer) => {
    setFormValues(
      customer
        ? {
            ...customer,
            dateOfBirth: new Date(customer.dateOfBirth)
              .toISOString()
              .split("T")[0],
          }
        : {
            name: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            gender: "",
            city: "",
            organizer: "",
          }
    );
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      fetchCurrentUser();
      toast.success("Customer deleted successfully");
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Error deleting customer");
    }
  };

  return (
    <Container component="main">
      <Menu />
      <Box sx={{ mt: 15 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Customer Dashboard
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleOpenDialog(null)}
        >
          Add Customer
        </Button>
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={headerStyles}>Name</TableCell>
                <TableCell sx={headerStyles}>Email</TableCell>
                <TableCell sx={headerStyles}>Phone</TableCell>
                <TableCell sx={headerStyles}>Gender</TableCell>

                {currentUser?.role !== "user" ? (
                  <>
                    <TableCell sx={headerStyles}>Organizer/User Name</TableCell>
                    <TableCell sx={headerStyles}>Role</TableCell>
                  </>
                ) : null}
                <TableCell sx={headerStyles}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers?.length > 0 ? (
                customers?.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.gender}</TableCell>
                    {currentUser?.role !== "user" ? (
                      <>
                        <TableCell>{customer?.organizer?.name}</TableCell>
                        <TableCell>{customer?.organizer?.role}</TableCell>
                      </>
                    ) : null}
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpenDialog(customer)}
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(customer._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No customer records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* popup for adding/updating customer */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {formValues._id ? "Update Customer" : "Add New Customer"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            fullWidth
            value={formValues.name}
            onChange={handleInputChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={formValues.email}
            onChange={handleInputChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            fullWidth
            value={formValues.phone}
            onChange={handleInputChange}
            error={!!formErrors.phone}
            helperText={formErrors.phone}
          />
          <TextField
            margin="dense"
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={formValues.dateOfBirth}
            onChange={handleInputChange}
            error={!!formErrors.dateOfBirth}
            helperText={formErrors.dateOfBirth}
          />
          <TextField
            margin="dense"
            name="gender"
            label="Gender"
            select
            fullWidth
            value={formValues.gender}
            onChange={handleInputChange}
            error={!!formErrors.gender}
            helperText={formErrors.gender}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            name="city"
            label="City"
            fullWidth
            value={formValues.city}
            onChange={handleInputChange}
            error={!!formErrors.city}
            helperText={formErrors.city}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {formValues._id ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
