import { Authenticator } from '@aws-amplify/ui-react'
import Button from '@mui/material/Button'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import React from 'react'
import Stack from '@mui/material/Stack'

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
        <Stack margin="auto" spacing={2}>
          <Authenticator initialState={authState} loginMechanisms={['phone_number']} signUpAttributes={['name']}>
            {({ user }) => {
              setLoggedInUser(user)
              return <></>
            }}
          </Authenticator>
          <div style={{ textAlign: 'center' }}>
            <Button onClick={() => setShowLogin(false)} startIcon={<CancelOutlinedIcon />} variant="outlined">
              Cancel
            </Button>
          </div>
        </Stack>
      </section>
    </main>
  )
}

export default LinksAuthenticator
