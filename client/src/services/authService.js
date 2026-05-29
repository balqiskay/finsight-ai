import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const API =
`${API_URL}/auth`;

export const registerUser = async (
  userData
) => {

  const response = await axios.post(
    `${API}/register`,
    userData
  );

  return response.data;
};

export const loginUser = async (
  userData
) => {

  const response = await axios.post(
    `${API}/login`,
    userData
  );

  return response.data;
};

export const verifyEmail =
async (token) => {

  const response =
    await axios.get(
      `${API_URL}/auth/verify-email/${token}`
    );

  return response.data;

};