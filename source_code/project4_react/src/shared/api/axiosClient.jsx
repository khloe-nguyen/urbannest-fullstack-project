import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/",
});

axiosClient.interceptors.request.use((config) => {
  let token = Cookies.get("CLIENT_ACCESS_TOKEN");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (response.status == 401 || response.status == 403) {
      Cookies.remove("CLIENT_ACCESS_TOKEN");
    }
  }
);

export default axiosClient;
