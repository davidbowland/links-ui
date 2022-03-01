import Container from '@mui/material/Container'
import React from 'react'
import { Helmet } from 'react-helmet'

import Redirect, { RedirectProps } from '@components/redirect'

import '@config/amplify'
import '@fontsource/rokkitt'
import 'normalize.css'
import '@assets/css/index.css'

export interface RedirectPageProps {
  params: RedirectProps
}

const RedirectPage = ({ params }: RedirectPageProps): JSX.Element => {
  return (
    <Container maxWidth="md">
      <main className="main-content">
        <Helmet>
          <title>Links Redirect | dbowland.com</title>
        </Helmet>
        <Redirect linkId={params.linkId} />
      </main>
    </Container>
  )
}

export default RedirectPage
