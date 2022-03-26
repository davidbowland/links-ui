import { Authenticator } from '@aws-amplify/ui-react'
import Button from '@mui/material/Button'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import React from 'react'

import { AuthState, CognitoUserAmplify } from '@types'

export interface LinksAuthenticatorProps {
  authState: AuthState
  setLoggedInUser: (user: CognitoUserAmplify | undefined) => void
  setShowLogin: (state: boolean) => void
}

const LinksAuthenticator = ({ authState, setLoggedInUser, setShowLogin }: LinksAuthenticatorProps): JSX.Element => {
  return (
    <main className="main-content">
      <section>
        <Authenticator initialState={authState} loginMechanisms={['phone_number']} signUpAttributes={['name']}>
          {({ user }) => {
            setLoggedInUser(user)
            return <></>
          }}
        </Authenticator>
        <p style={{ textAlign: 'center' }}>
          <Button onClick={() => setShowLogin(false)} startIcon={<CancelOutlinedIcon />} variant="outlined">
            Cancel
          </Button>
        </p>
      </section>
    </main>
  )
}

export default LinksAuthenticator
