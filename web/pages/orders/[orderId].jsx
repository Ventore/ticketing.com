import { useEffect, useState } from 'react';
import useRequest from '../../hooks/useRequest';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const findTimeLeft = () => {
    const time = new Date(order.expiresAt) - new Date();
    setTimeLeft(Math.round(time / 1000));
  };

  const { doRequest, errors } = useRequest({
    url: '/api/v1/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    findTimeLeft();

    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft < 0) {
    return <div>Order expired</div>;
  }

  return (
    <div>
      <div>{timeLeft} seconds until order expires</div>
      {errors}
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        amount={order.ticket.price * 100}
        email={currentUser.email}
        //TODO: Extract to env
        stripeKey="pk_test_51Grr7YI6vubA3txO7FRFtfE9czH8w9Y4oKhFy1ZjfBLJHQBa9j3dKpJbMaZXwDxdeOxEI827AngHOlrFJUM1cM0J00wR9RQHh7"
      />
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;

  const { data } = await client.get('/api/v1/orders/' + orderId);
  return { order: data };
};

export default OrderShow;
