import React, { useEffect, Suspense } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../store/actions/index';

import Layout from '../hoc/Layout/Layout';
import BurgerBuilder from './BurgerBuilder/BurgerBuilder';

import Logout from './Auth/Logout/Logout';

const Checkout = React.lazy(() => {
  return import('./CheckOut/CheckOut');
});

const Orders = React.lazy(() => {
  return import('./Orders/Orders');
});

const Auth = React.lazy(() => {
  return import('./Auth/Auth');
});

const App = props => {
  useEffect(() => {
    props.onTryAutoSignup();
  });

  let routes = (
    <Switch>
      <Route path='/auth' render={props => <Auth {...props} />} />
      <Route path='/' exact component={BurgerBuilder} />
      <Redirect to='/' />
    </Switch>
  );

  if (props.isAuthenticated) {
    routes = (
      <Switch>
        <Route path='/checkout' render={props => <Checkout {...props} />} />
        <Route path='/orders' render={props => <Orders {...props} />} />
        <Route path='/logout' component={Logout} />
        <Route path='/auth' render={props => <Auth {...props} />} />
        <Route path='/' exact component={BurgerBuilder} />
        <Redirect to='/' />
      </Switch>
    );
  }

  return (
    <div>
      <Layout>
        <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
      </Layout>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDisptachToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  };
};

export default withRouter(connect(mapStateToProps, mapDisptachToProps)(App));
