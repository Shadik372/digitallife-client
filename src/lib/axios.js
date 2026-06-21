import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true, // ensures the auth cookie is sent on every request, cross-origin included
});

export default api;