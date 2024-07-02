import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import setAuthToken from "../utils/setAuthToken";

const initialState = {
  isAuthenticated: false,
  user: {},
  loading: true,
};

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return {
        ...state,
        isAuthenticated: !!action.payload,
        user: action.payload,
        loading: false,
      };
    case "USER_LOADING":
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);
  const BASE_URL = "http://localhost:5000/api/users";
  
  useEffect(() => {
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
  }, []);

  const registerUser = (userData) => {
    return axios.post(BASE_URL + "/register", userData);
  };

  const loginUser = async (userData) => {
    try {
      const res = await axios.post(BASE_URL + "/login", userData);
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      setAuthToken(token);
      const decoded = jwtDecode(token);
      dispatch({
        type: "SET_CURRENT_USER",
        payload: decoded,
      });
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const logoutUser = (navigate) => {
    localStorage.removeItem("jwtToken");
    setAuthToken(false);
    dispatch({
      type: "SET_CURRENT_USER",
      payload: {},
    });
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        registerUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
