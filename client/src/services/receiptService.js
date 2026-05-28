import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL;

const API =
  `${API_URL}/receipt`;

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token");

  return {
    headers: {
      Authorization:
        `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };
};

export const scanReceipt =
async (file) => {

  const formData =
    new FormData();

  formData.append(
    "receipt",
    file
  );

  const response =
    await axios.post(
      `${API}/scan`,
      formData,
      getAuthHeaders()
    );

  return response.data;

};