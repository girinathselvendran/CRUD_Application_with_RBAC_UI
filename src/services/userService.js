import axios from "axios";

const BASE_API_URL = "https://crud-application-with-rbac-api.onrender.com/api/users";

const fetchAllUsers = async () => {
  try {
    const response = await axios.get(BASE_API_URL + "/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const getCurrentUser = async () => {
  try {
    const response = await axios.get(BASE_API_URL + "/current");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export { fetchAllUsers, getCurrentUser };
