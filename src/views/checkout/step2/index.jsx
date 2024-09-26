/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Boundary } from '@/components/common';
import { CHECKOUT_STEP_1, CHECKOUT_STEP_3 } from '@/constants/routes';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import PropType from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setShippingDetails } from '@/redux/actions/checkoutActions';
import { StepTracker } from '../components';
import withCheckout from '../hoc/withCheckout';
import ShippingForm from './ShippingForm';
import ShippingTotal from './ShippingTotal';

const ShippingDetails = ({ profile, shipping, subtotal }) => {
  useDocumentTitle('Check Out Step 2 | Salinaka');
  useScrollTop();
  const dispatch = useDispatch();
  const history = useHistory();

  const [formValues, setFormValues] = useState({
    fullname: shipping.fullname || profile.fullname || '',
    email: shipping.email || profile.email || '',
    address: shipping.address || profile.address || '',
    mobile: shipping.mobile || profile.mobile || {},
    isInternational: shipping.isInternational || false,
    isDone: shipping.isDone || false
  });

  const [errors, setErrors] = useState({
    fullname: '',
    email: '',
    address: '',
    mobile: ''
  });

  const validateForm = () => {
    const newErrors = {
      fullname: '',
      email: '',
      address: '',
      mobile: ''
    };

    if (!formValues.fullname) {
      newErrors.fullname = 'Full name is required.';
    } else if (formValues.fullname.length < 2 || formValues.fullname.length > 60) {
      newErrors.fullname = 'Full name must be between 2 and 60 characters long.';
    }

    if (!formValues.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = 'Email is not valid.';
    }

    if (!formValues.address) {
      newErrors.address = 'Shipping address is required.';
    }

    if (!formValues.mobile.value) {
      newErrors.mobile = 'Mobile number is required.';
    }

    setErrors(newErrors);
  };

  const onSubmitForm = (event) => {
    event.preventDefault();
    validateForm();

    if (Object.values(errors).every((error) => error === '')) {
      dispatch(setShippingDetails({
        fullname: formValues.fullname,
        email: formValues.email,
        address: formValues.address,
        mobile: formValues.mobile,
        isInternational: formValues.isInternational,
        isDone: true
      }));
      history.push(CHECKOUT_STEP_3);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <Boundary>
      <div className="checkout">
        <StepTracker current={2} />
        <div className="checkout-step-2">
          <h3 className="text-center">Shipping Details</h3>
          <form onSubmit={onSubmitForm}>
            <ShippingForm
              values={formValues}
              errors={errors}
              handleChange={handleChange}
            />
            <br />
            {/*  ---- TOTAL --------- */}
            <ShippingTotal subtotal={subtotal} />
            <br />
            {/*  ----- NEXT/PREV BUTTONS --------- */}
            <div className="checkout-shipping-action">
              <button
                className="button button-muted"
                onClick={() => history.push(CHECKOUT_STEP_1)}
                type="button"
              >
                <ArrowLeftOutlined />
                &nbsp;
                Go Back
              </button>
              <button
                className="button button-icon"
                type="submit"
              >
                Next Step
                &nbsp;
                <ArrowRightOutlined />
              </button>
            </div>
          </form>
        </div>
      </div>
    </Boundary>
  );
};

ShippingDetails.propTypes = {
  subtotal: PropType.number.isRequired,
  profile: PropType.shape({
    fullname: PropType.string,
    email: PropType.string,
    address: PropType.string,
    mobile: PropType.object
  }).isRequired,
  shipping: PropType.shape({
    fullname: PropType.string,
    email: PropType.string,
    address: PropType.string,
    mobile: PropType.object,
    isInternational: PropType.bool,
    isDone: PropType.bool
  }).isRequired
};

export default withCheckout(ShippingDetails);