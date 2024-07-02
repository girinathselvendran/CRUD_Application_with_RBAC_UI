import axios from "axios";
import { jwtDecode } from "jwt-decode";
import setAuthToken from "../utils/setAuthToken";

const BASE_URL = "http://localhost:5000/api/users";

export const registerUser = (userData) => {
  return axios.post(BASE_URL + "/register", userData);
};

export const loginUser = async (userData) => {
  try {
    const res = await axios.post(BASE_URL + "/login", userData);
    const { token } = res.data;
    localStorage.setItem("jwtToken", token);
    setAuthToken(token);
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("There was an error!", error);
    throw error;
  }
};

export const logoutUser = (navigate) => {
  localStorage.removeItem("jwtToken");
  setAuthToken(false);
  navigate("/login");
};

export const checkAuthToken = (dispatch) => {
  if (localStorage.jwtToken) {
    const token = localStorage.jwtToken;
    setAuthToken(token);
    const decoded = jwtDecode(token);
    dispatch({
      type: "SET_CURRENT_USER",
      payload: decoded,
    });
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      logoutUser();
    }
  }
};
