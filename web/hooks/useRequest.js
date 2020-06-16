import axios from 'axios';
import Router from 'next/router';
import { useState } from 'react';

export default ({ url, method, body, onSuccess = () => {} }) => {
  const [errors, setErrors] = useState(null);
  const doRequest = async (bodyOptions = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...bodyOptions });
      onSuccess(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops...</h4>
          <ul>
            {err.response.data.map((error, i) => {
              return <li key={i}>{error.message}</li>;
            })}
          </ul>
        </div>,
      );
    }
  };

  return { doRequest, errors };
};
