import { useState } from 'react';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/v1/tickets/',
    method: 'post',
    body: { title, price },
    onSuccess: () => Router.push('/'),
  });

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    await doRequest();
  };
  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <h1>Create new ticket</h1>
      {errors}
      <div className="form-group">
        <label htmlFor="">Title</label>
        <input
          className="form-control"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="">Price</label>
        <input
          className="form-control"
          type="number"
          value={price}
          onBlur={() => onBlur()}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <button className="btn btn-primary">Create</button>
    </form>
  );
};
export default NewTicket;
