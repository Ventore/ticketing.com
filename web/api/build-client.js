import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL:
        'http://www.swaip.app/',
      headers: req.headers,
    });
  } else {
    return axios.create();
  }
};
