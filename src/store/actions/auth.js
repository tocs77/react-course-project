import axios from '../../axios-orders';
import * as actionTypes from './actionTypes';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId: userId
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const auth = (email, password, isSignup) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
      //'Content-Type': 'application/json'
      //'Content-Type': 'multipart/form-data',
    };
    let url = '/signupuser';
    if (!isSignup) {
      url = '/signinuser';
    }
    axios
      .post(url, authData, { headers: headers })
      .then(response => {
        console.log(response);
        dispatch(authSuccess(response.data.idToken, response.data.localId));
      })
      .catch(err => {
        console.log(err);
        dispatch(authFail(err));
      });
  };
};
