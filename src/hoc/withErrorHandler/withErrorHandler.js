import React, { useState, useEffect } from 'react';

import Modal from '../../components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios) => {
  return props => {
    const [error, setError] = useState(null);

    const reqInerceptor = axios.interceptors.request.use(req => {
      setError(null);
      return req;
    });
    const respInterceptor = axios.interceptors.response.use(
      res => res,
      err => {
        setError(err);
      }
    );

    useEffect(() => {
      return () => {
        axios.interceptors.request.eject(reqInerceptor);
        axios.interceptors.response.eject(respInterceptor);
      };
    }, [reqInerceptor, respInterceptor]);

    const errorConfirmedHandler = () => {
      setError(null);
    };

    return (
      <React.Fragment>
        <Modal show={error} modalClosed={errorConfirmedHandler}>
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </React.Fragment>
    );
  };
};

export default withErrorHandler;
