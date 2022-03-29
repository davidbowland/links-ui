import { Helmet } from 'react-helmet'
import Paper from '@mui/material/Paper'
import React from 'react'

import '@config/amplify'
import Redirect, { RedirectProps } from '@components/redirect'
import Themed from '@components/themed'

import '@assets/css/index.css'
import '@fontsource/rokkitt'
import 'normalize.css'

export interface RedirectPageProps {
  params: RedirectProps
}

const RedirectPage = ({ params }: RedirectPageProps): JSX.Element => {
  return (
    <Themed>
      <Paper elevation={3} sx={{ margin: '1em auto', maxWidth: '900px' }}>
        <main className="main-content">
          <Helmet>
            <title>Links Redirect | dbowland.com</title>
          </Helmet>
          <Redirect linkId={params.linkId} />
        </main>
      </Paper>
    </Themed>
  )
}

export default RedirectPage
