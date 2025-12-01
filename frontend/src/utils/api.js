import axios from "axios";

const api = axios.create({
  baseURL: "http://leisureupup.com:8080/api",
});

export default api;