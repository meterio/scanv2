import axios from "axios";

const instance = axios.create();

instance.interceptors.response.use((res) => {
  return {
    error: false,
    data: res.data
  };
}, err => {
  return {
    error: true,
    msg: err.response ? err.response.data : err.message
  }
})

export const fetch = (url, method, data = {}, options = {
  Headers: {
    "Content-Type": "application/json",
  }
}) => {
  return instance({
    url,
    method,
    data,
    ...options
  })
}