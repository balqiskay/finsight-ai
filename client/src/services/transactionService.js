import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const API =
`${API_URL}/transactions`;

export const addTransaction =
  async (transactionData) => {

    const token =
      localStorage.getItem("token");

    const response = await axios.post(
      API,
      transactionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
};

export const getTransactions =
  async () => {

    const token =
      localStorage.getItem("token");

    const response = await axios.get(
      API,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
};

export const deleteTransaction =
  async (id) => {

    const token =
      localStorage.getItem("token");

    const response = await axios.delete(
      `${API}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
};

export const updateTransaction =
async (id, transactionData) => {

  const token =
    localStorage.getItem("token");

  const response =
    await axios.put(
      `${API}/${id}`,
      transactionData,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;

};