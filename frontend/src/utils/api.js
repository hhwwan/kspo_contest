import axios from "axios";

const api = axios.create({
  baseURL: "http://13.124.222.250:8080/api",
});

export default api;