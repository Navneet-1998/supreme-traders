/* authentication file */
import { SIGNIN } from '@/constants/routes';
import { calculateTotal } from '@/helpers/utils';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

const withCheckout = (Component) => withRouter((props) => {
  const state = useSelector((store) => ({
    isAuth: !!store.auth.id && !!store.auth.role, // Check for authentication
    basket: store.basket,
    shipping: store.checkout.shipping,
    payment: store.checkout.payment,
    profile: store.profile,
  }));

  const shippingFee = state.shipping.isInternational ? 50 : 0;
  const subtotal = calculateTotal(state.basket.map((product) => product.price * product.quantity));

  if (!state.isAuth) {
    return <Redirect to={SIGNIN} />; // Redirect if not authenticated
  } 

  if (state.basket.length === 0) {
    return <Redirect to="/" />;
  }

  return (
    <Component
      {...props}
      basket={state.basket}
      payment={state.payment}
      profile={state.profile}
      shipping={state.shipping}
      subtotal={Number(subtotal + shippingFee)}
    />
  );
});

export default withCheckout;
