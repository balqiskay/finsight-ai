import axios from "axios";

const API_URL =
import.meta.env.VITE_API_URL;

const API =
`${API_URL}/recurring`;

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

export const addRecurringTransaction =
async (recurringData) => {

  const response =
    await axios.post(
      API,
      recurringData,
      getAuthHeaders()
    );

  return response.data;
};

export const getRecurringTransactions =
async () => {

  const response =
    await axios.get(
      API,
      getAuthHeaders()
    );

  return response.data;
};

export const updateRecurringTransaction =
async (id, recurringData) => {

  const response =
    await axios.put(
      `${API}/${id}`,
      recurringData,
      getAuthHeaders()
    );

  return response.data;
};

export const deleteRecurringTransaction =
async (id) => {

  const response =
    await axios.delete(
      `${API}/${id}`,
      getAuthHeaders()
    );

  return response.data;
};