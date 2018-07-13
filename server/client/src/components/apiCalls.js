import axios from 'axios';

export const apiPOST = async(url, params) => {
  return axios.post(url,params)
  .then((response) => {
    return Promise.resolve(response);
  })
  .catch((err) => {
    return Promise.reject(err);
  });
};

export const apiGET = async(url, params) => {
  return axios.get(url)
  .then((response) => {
    return Promise.resolve(response);
  })
  .catch((err) => {
    return Promise.reject(err);
  });
};

export const apiDELETE = async(url, params) => {
  return axios.delete(url,params)
  .then((response) => {
    return Promise.resolve(response);
  })
  .catch((err) => {
    return Promise.reject(err);
  });
};