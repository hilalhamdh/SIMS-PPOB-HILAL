import axios from 'axios';

const dataApi = axios.create({
  baseURL: 'https://api-doc-tht.nutech-integrasi.com',
  headers: {
    'Content-Type': 'application/json',
  },
});
export default dataApi;
