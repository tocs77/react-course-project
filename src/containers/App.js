import React, { useEffect } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import asyncComponent from '../hoc/asyncComponent/asyncComponent';

import * as actions from '../store/actions/index';

import Layout from '../hoc/Layout/Layout';
import BurgerBuilder from './BurgerBuilder/BurgerBuilder';

import Logout from './Auth/Logout/Logout';

const asyncCheckout = asyncComponent(() => {
  return import('./CheckOut/CheckOut');
});

const asyncOrders = asyncComponent(() => {
  return import('./Orders/Orders');
});

const asyncAuth = asyncComponent(() => {
  return import('./Auth/Auth');
});

const App = props => {
  useEffect(() => {
    props.onTryAutoSignup();
  });

  let routes = (
    <Switch>
      <Route path='/auth' component={asyncAuth} />
      <Route path='/' exact component={BurgerBuilder} />
      <Redirect to='/' />
    </Switch>
  );

  if (props.isAuthenticated) {
    routes = (
      <Switch>
        <Route path='/checkout' component={asyncCheckout} />
        <Route path='/orders' component={asyncOrders} />
        <Route path='/logout' component={Logout} />
        <Route path='/auth' component={asyncAuth} />
        <Route path='/' exact component={BurgerBuilder} />
        <Redirect to='/' />
      </Switch>
    );
  }

  return (
    <div>
      <Layout>{routes}</Layout>
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
