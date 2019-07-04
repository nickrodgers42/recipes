import React from 'react'
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core'
import useStyles from './navbarStyle'
import {
  Menu as MenuIcon,
} from '@material-ui/icons'
import { Link } from 'react-router-dom'
import SearchComponent from './searchComponent/searchComponent'


export default function Navbar() {
  const classes = useStyles();
  return (
    <AppBar className={classes.appbar} position='sticky'>
      <Toolbar>
        <IconButton className={classes.menuButton}>
          <MenuIcon />
        </IconButton>
        <Link to='/' className={classes.homeLink}>
          <Typography variant='h5' className={classes.title}>
            Nana's Cookbook
          </Typography>
        </Link>
        <div className={classes.grow} />
        <SearchComponent className={classes.search} />
        <Button className={classes.logInButton} variant='outlined'>
          Log In
        </Button>
        <Button className={classes.signUpButton} variant='contained'>
          Sign Up
        </Button>
      </Toolbar>
    </AppBar>
  )
}
