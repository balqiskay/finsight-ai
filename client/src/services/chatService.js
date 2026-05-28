import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL;

const API =
  `${API_URL}/chat`;

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

export const askFinancialAssistant =
async (question) => {

  const response =
    await axios.post(
      `${API}/ask`,
      { question },
      getAuthHeaders()
    );

  return response.data;

};

export const getChatHistory =
async () => {

  const response =
    await axios.get(
      `${API}/history`,
      getAuthHeaders()
    );

  return response.data;

};