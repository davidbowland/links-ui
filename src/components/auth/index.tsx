import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import Button from '@mui/material/Button'
import React from 'react'

export interface AuthenticatedProps {
  children: JSX.Element | JSX.Element[]
}

const Authenticated = ({ children }: AuthenticatedProps): JSX.Element => {
  return (
    <Authenticator loginMechanisms={['phone_number']} signUpAttributes={['name']}>
      {({ signOut }) => (
        <>
          {children}
          <p>
            <Button variant="outlined" fullWidth onClick={signOut}>
              Sign out
            </Button>
          </p>
        </>
      )}
    </Authenticator>
  )
}

export default Authenticated
