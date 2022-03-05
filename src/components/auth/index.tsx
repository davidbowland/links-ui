import { Auth } from 'aws-amplify'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import DeleteIcon from '@mui/icons-material/Delete'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import Alert from '@mui/material/Alert'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Snackbar from '@mui/material/Snackbar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'

import { CognitoUserAmplify } from '@types'

export interface AuthenticatedProps {
  children: JSX.Element | JSX.Element[]
}

const Authenticated = ({ children }: AuthenticatedProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [loggedInUser, setLoggedInUser] = useState<CognitoUserAmplify | undefined>(undefined)
  const [showDeleteErrorSnackbar, setShowDeleteErrorSnackbar] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const openMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = (): void => {
    setAnchorEl(null)
  }

  const snackbarClose = (): void => {
    setShowDeleteErrorSnackbar(false)
  }

  const renderLoggedInBar = (): JSX.Element => {
    return (
      <>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={openMenu}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          URL Shortener
        </Typography>
        <Typography component="div">Welcome, {loggedInUser?.attributes?.name}</Typography>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={closeMenu}
        >
          <MenuItem
            onClick={() => {
              Auth.signOut()
              setLoggedInUser(undefined)
            }}
          >
            <LogoutIcon /> Sign out
          </MenuItem>
          <MenuItem
            onClick={() => {
              loggedInUser?.deleteUser((err) => {
                if (err) {
                  setShowDeleteErrorSnackbar(true)
                  console.error(err)
                } else {
                  setLoggedInUser(undefined)
                  Auth.signOut({ global: true })
                }
              })
            }}
          >
            <DeleteIcon /> Delete account
          </MenuItem>
        </Menu>
      </>
    )
  }

  const renderLoggedOutBar = (): JSX.Element => {
    return (
      <>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          URL Shortener
        </Typography>
        <Button onClick={() => setShowLogin(true)} sx={{ color: 'white', display: 'block' }} startIcon={<LoginIcon />}>
          Sign In
        </Button>
      </>
    )
  }

  const renderAuthenticator = (): JSX.Element => {
    return (
      <main className="main-content">
        <section>
          <Authenticator loginMechanisms={['phone_number']} signUpAttributes={['name']}>
            {({ user }) => {
              setLoggedInUser(user)
              return <></>
            }}
          </Authenticator>
          <p style={{ textAlign: 'center' }}>
            <Button variant="outlined" onClick={() => setShowLogin(false)}>
              Cancel
            </Button>
          </p>
        </section>
      </main>
    )
  }

  useEffect(() => {
    setAnchorEl(null)
    setShowLogin(false)
  }, [loggedInUser])

  // Set user if already logged in
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(setLoggedInUser)
      .catch(() => null)
  }, [])

  return (
    <>
      <AppBar position="static">
        <Toolbar>{loggedInUser ? renderLoggedInBar() : renderLoggedOutBar()}</Toolbar>
      </AppBar>
      {showLogin && !loggedInUser ? renderAuthenticator() : children}
      <Snackbar open={showDeleteErrorSnackbar} autoHideDuration={6000} onClose={snackbarClose}>
        <Alert onClose={snackbarClose} severity="error" sx={{ width: '100%' }}>
          There was a problem deleting your account. Please try again later.
        </Alert>
      </Snackbar>
    </>
  )
}

export default Authenticated
