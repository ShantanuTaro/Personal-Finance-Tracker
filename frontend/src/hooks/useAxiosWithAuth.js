import axios from 'axios';
import { useSelector } from 'react-redux';

const useAxiosWithAuth = () => {
  const token = useSelector((state) => state.auth.token);

  const axiosInstance = axios.create();

  // Add a request interceptor to attach the token
  axiosInstance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Attach token to every request
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxiosWithAuth;
