import axios from "axios";

const API_URL =
import.meta.env.VITE_API_URL;

const API =
`${API_URL}/savings`;

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token");

  return {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };
};

export const addSavingsGoal =
async (goalData) => {

  const response =
    await axios.post(
      API,
      goalData,
      getAuthHeaders()
    );

  return response.data;
};

export const getSavingsGoals =
async () => {

  const response =
    await axios.get(
      API,
      getAuthHeaders()
    );

  return response.data;
};

export const updateSavingsGoal =
async (id, goalData) => {

  const response =
    await axios.put(
      `${API}/${id}`,
      goalData,
      getAuthHeaders()
    );

  return response.data;
};

export const deleteSavingsGoal =
async (id) => {

  const response =
    await axios.delete(
      `${API}/${id}`,
      getAuthHeaders()
    );

  return response.data;
};