import axios from 'axios';
import { resolveOfflineMock } from './utils/mockApi';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  auth: {
    username: 'testserver',
    password: 'testserver'
  },
  headers: {
    'Access-Control-Allow-Origin': '*',
    accept: 'application/json',
    'Content-type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error?.config?.url;
    const isNetworkIssue =
      error?.code === 'ERR_NETWORK' ||
      error?.message === 'Network Error';

    if (isNetworkIssue && requestUrl) {
      const mocked = resolveOfflineMock(requestUrl);
      if (mocked) {
        return Promise.resolve({
          data: mocked,
          status: 200,
          statusText: 'OK (mocked)',
          headers: {},
          config: error.config,
        });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
