import Grid from '@mui/material/Grid'
import { Helmet } from 'react-helmet'
import React from 'react'

import Redirect, { RedirectProps } from '@components/redirect'

export interface RedirectPageProps {
  params: RedirectProps
}

const RedirectPage = ({ params }: RedirectPageProps): JSX.Element => {
  return (
    <main>
      <Helmet>
        <title>Links Redirect | dbowland.com</title>
      </Helmet>
      <Grid style={{ padding: '50px' }}>
        <div style={{ margin: 'auto', maxWidth: '700px' }}>
          <Redirect linkId={params.linkId} />
        </div>
      </Grid>
    </main>
  )
}

export default RedirectPage
