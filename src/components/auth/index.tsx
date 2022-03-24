import { Auth } from 'aws-amplify'
import '@aws-amplify/ui-react/styles.css'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import React, { useEffect, useState } from 'react'

import LoggedInBar from './logged-in-bar'
import LoggedOutBar from './logged-out-bar'
import LinksAuthenticator from './links-authenticator'
import { AuthState, CognitoUserAmplify } from '@types'

export interface AuthenticatedProps {
  children: JSX.Element | JSX.Element[]
}

const Authenticated = ({ children }: AuthenticatedProps): JSX.Element => {
  const [authState, setAuthState] = useState<AuthState>('signIn')
  const [loggedInUser, setLoggedInUser] = useState<CognitoUserAmplify | undefined>(undefined)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
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
        <Toolbar>
          {loggedInUser ? (
            <LoggedInBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
          ) : (
            <LoggedOutBar setAuthState={setAuthState} setShowLogin={setShowLogin} />
          )}
        </Toolbar>
      </AppBar>
      {showLogin && !loggedInUser ? (
        <LinksAuthenticator authState={authState} setLoggedInUser={setLoggedInUser} setShowLogin={setShowLogin} />
      ) : (
        children
      )}
    </>
  )
}

export default Authenticated
