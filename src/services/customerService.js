import axios from "axios";

const API_URL = "/api/customers";

export const getCustomersList = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};
export const getCustomersByOrganizer = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/organizer/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

export const addCustomer = async (customer) => {
  try {
    const response = await axios.post(API_URL, customer);
    return response.data;
  } catch (error) {
    console.error("Error adding customer:", error);
    throw error;
  }
};

export const updateCustomer = async (id, customer) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, customer);
    return response.data;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};
