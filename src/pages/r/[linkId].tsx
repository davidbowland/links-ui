import Grid from '@mui/material/Grid'
import { Helmet } from 'react-helmet'
import React from 'react'

import Redirect, { RedirectProps } from '@components/redirect'
import PrivacyLink from '@components/privacy-link'

export interface RedirectPageProps {
  params: RedirectProps
}

const RedirectPage = ({ params }: RedirectPageProps): JSX.Element => {
  return (
    <main>
      <Helmet>
        <title>Links Redirect | dbowland.com</title>
      </Helmet>
      <Grid container sx={{ padding: { sm: '50px', xs: '25px 10px' } }}>
        <Grid item sx={{ m: 'auto', maxWidth: 700, width: '100%' }}>
          <Redirect linkId={params.linkId} />
          <PrivacyLink />
        </Grid>
      </Grid>
    </main>
  )
}

export default RedirectPage
