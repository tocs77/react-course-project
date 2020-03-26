import { useState, useEffect } from 'react';

export default httpClient => {
  const [error, setError] = useState(null);

  const reqInerceptor = httpClient.interceptors.request.use(req => {
    setError(null);
    return req;
  });
  const respInterceptor = httpClient.interceptors.response.use(
    res => res,
    err => {
      setError(err);
    }
  );

  useEffect(() => {
    return () => {
      httpClient.interceptors.request.eject(reqInerceptor);
      httpClient.interceptors.response.eject(respInterceptor);
    };
  }, [reqInerceptor, respInterceptor]);

  const errorConfirmedHandler = () => {
    setError(null);
  };

  return [error, errorConfirmedHandler];
};
