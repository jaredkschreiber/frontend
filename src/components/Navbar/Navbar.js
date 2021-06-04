import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  ButtonBase,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { signOut, selectUser, clearUser } from '../../store/User/UserSlice';

import clsx from 'clsx';

import { useStyles } from './NavbarStyles';

export const Navbar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [menuStatus, setMenuStatus] = useState(null);

  const { isSuccess, isError, username } = useSelector(
    selectUser
  );

  useEffect(() => {
    return () => {
      dispatch(clearUser());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(clearUser());
    }

    if (isSuccess) {
      dispatch(clearUser());
      history.push('/');
    }
  }, [dispatch, history, isError, isSuccess]);

  const logOut = (event) => {
    dispatch(signOut());
  };

  const openMenu = (event) => {
    setMenuStatus(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuStatus(null);
  };

  const curPath = useLocation()?.pathname;
  const navBarUserRoutes = [
    {
      name: "Profile",
      route: "/profile"
    }
  ];

  return (
    <AppBar position="fixed">
      <Toolbar className={classes.toolBar}>
        <Link to={'/'} style={{textDecoration: 'none'}}>
          <ButtonBase>
            <div className={classes.toolBarLeftContainer}>
                <Typography className={classes.title}>Book</Typography>
                <img src={process.env.PUBLIC_URL + '/open-book.png'} alt={"Book Self Logo"} className={classes.image} />
                <Typography className={classes.title}><b>Self</b></Typography>
            </div>
          </ButtonBase>
        </Link>

        <Box className={classes.menu}>
          { localStorage.getItem('token') && navBarUserRoutes.map(routeInfo =>
              <Button component={Link} style={{fontSize: '.95rem'}} key={routeInfo['route']} to={routeInfo['route']} className={clsx({ [classes.navBarCurrentRoute]: routeInfo['route'] === curPath })}>
                { routeInfo['name'] }
              </Button>
            )
          }
        </Box>

        <Box>
          <IconButton color="inherit" aria-label="account" aria-haspopup="true" onClick={openMenu}>
            <AccountCircle className={classes.accountIcon} />
          </IconButton>

          <Menu
            id="simple-menu"
            anchorEl={menuStatus}
            keepMounted
            open={Boolean(menuStatus)}
            onClose={closeMenu}
          >
            {localStorage.getItem('token') ? (
              [
                <Typography key="account" className={classes.account}>{username}</Typography>,
                <Divider key="divider" />,
                <MenuItem key="signout" onClick={() => { logOut(); closeMenu(); }}>Sign Out</MenuItem>
              ]
            ) : (
              [
                <MenuItem component={Link} key="signin" to="/signin" onClick={closeMenu}>Sign In</MenuItem>,
                <MenuItem component={Link} key="signup" to="/signup" onClick={closeMenu}>Sign Up</MenuItem>
              ]
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

