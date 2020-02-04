import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchseBurgerSuccess = (id, orderData) => {
  return {
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    orderId: id,
    orderData: orderData
  };
};

export const purchseBurgerFail = error => {
  return {
    type: actionTypes.PURCHASE_BURGER_FAIL,
    error: error
  };
};

export const purchaseBurgerStart = () => {
  return {
    type: actionTypes.PURCHASE_BURGER_START
  };
};

export const purchaseBurger = orderData => {
  return dispatch => {
    dispatch(purchaseBurgerStart());
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
      //'Content-Type': 'application/json',
      //'Content-Type': 'multipart/form-data',
    };
    axios
      .post('/orders', orderData, { headers: headers })
      .then(response => {
        console.log(response.data);
        dispatch(purchseBurgerSuccess(response.data.name, orderData));
      })
      .catch(error => {
        dispatch(purchseBurgerFail(error));
      });
  };
};

export const purchaseInit = () => {
  return {
    type: actionTypes.PURCHASE_INIT
  };
};
