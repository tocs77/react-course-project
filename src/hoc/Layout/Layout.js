import React, { useState } from 'react';
import { connect } from 'react-redux';

import Toolbar from '../../components/Navigation/Toolbar/Toolbar';

import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

import classes from './Layout.module.css';

const Layot = props => {
  const [showSideDrower, setShowSideDrower] = useState(false);

  const sideDrawerClosedHandler = () => {
    setShowSideDrower(false);
  };

  const sideDrawerToggleHandler = () => {
    setShowSideDrower(!showSideDrower);
  };

  return (
    <React.Fragment>
      <Toolbar isAuth={props.isAuthenticated} drawerToggleClicked={sideDrawerToggleHandler} />
      <SideDrawer
        isAuth={props.isAuthenticated}
        closed={sideDrawerClosedHandler}
        show={showSideDrower}
      />
      <main className={classes.Content}>{props.children}</main>
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};
export default connect(mapStateToProps)(Layot);
