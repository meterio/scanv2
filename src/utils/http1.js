import axios from "axios";

export const fetch = (url, method, data = {}, options = {
  Headers: {
    "Content-Type": "application/json"
  }
}) => {
  return axios({
    url,
    method,
    data,
    ...options
  })
}