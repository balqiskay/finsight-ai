import axios from "axios";

const API =
  "http://localhost:5000/api/ai";

export const getAIInsights =
async () => {

  const token =
    localStorage.getItem("token");

  const response =
    await axios.get(
      `${API}/insights`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;

};