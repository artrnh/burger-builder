import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burger-builder-f8e0d.firebaseio.com/'
});

export default instance;