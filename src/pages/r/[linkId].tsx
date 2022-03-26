import Container from '@mui/material/Container'
import { Helmet } from 'react-helmet'
import React from 'react'

import '@config/amplify'
import Redirect, { RedirectProps } from '@components/redirect'

import '@assets/css/index.css'
import '@fontsource/rokkitt'
import 'normalize.css'

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
