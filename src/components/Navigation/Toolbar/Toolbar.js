import React from 'react';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';

import DrawToggle from '../SideDrawer/SideDrawerToggler/DrawerToggle';

import classes from './Toolbar.module.css';


const toolbar = (props) =>(
    <header className={classes.Toolbar}>
        <DrawToggle clicked={props.drawerToggleClicked}/>
        <div className={classes.Logo}>
            <Logo />   
        </div>
        
        <nav className={classes.DesktopOnly}>
            <NavigationItems />
        </nav>
    </header>
)

export default toolbar