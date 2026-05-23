import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const API =
`${API_URL}/analytics`;

export const getFinancialSummary =
  async () => {

    const token =
      localStorage.getItem("token");

    const response = await axios.get(
      `${API}/summary`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
};

export const getCategoryBreakdown =
  async () => {

    const token =
      localStorage.getItem("token");

    const response = await axios.get(
      `${API}/categories`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
};

export const getMonthlyAnalytics =
async () => {

  const token =
    localStorage.getItem("token");

  const response =
    await axios.get(
      `${API}/monthly`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;

};

export const getAdvancedAnalytics =
async () => {

  const token =
    localStorage.getItem("token");

  const response =
    await axios.get(
      `${API}/advanced`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;

};