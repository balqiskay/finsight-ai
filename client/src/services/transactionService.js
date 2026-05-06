import axios from "axios";

const API_URL =
  "http://localhost:5000/api/transactions";

export const addTransaction =
  async (transactionData) => {

    const token =
      localStorage.getItem("token");

    const response = await axios.post(
      API_URL,
      transactionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
};