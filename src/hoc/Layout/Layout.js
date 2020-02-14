import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../Auxlillary/auxillary';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';

import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

import classes from './Layout.module.css';

class Layot extends Component {
  state = {
    showSideDrower: false
  };

  sideDrawerClosedHandler = () => {
    this.setState({ showSideDrower: false });
  };

  sideDrawerToggleHandler = () => {
    this.setState(prevState => {
      return { showSideDrower: !prevState.showSideDrower };
    });
  };

  render() {
    return (
      <Aux>
        <Toolbar
          isAuth={this.props.isAuthenticated}
          drawerToggleClicked={this.sideDrawerToggleHandler}
        />
        <SideDrawer
          isAuth={this.props.isAuthenticated}
          closed={this.sideDrawerClosedHandler}
          show={this.state.showSideDrower}
        />
        <main className={classes.Content}>{this.props.children}</main>
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};
export default connect(mapStateToProps)(Layot);
