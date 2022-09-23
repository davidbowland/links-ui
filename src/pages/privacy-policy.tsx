import Grid from '@mui/material/Grid'
import { Helmet } from 'react-helmet'
import Paper from '@mui/material/Paper'
import React from 'react'

import '@config/amplify'
import PrivacyPolicy from '@components/privacy-policy'

const PrivacyPage = (): JSX.Element => {
  return (
    <Paper elevation={1}>
      <Helmet>
        <title>Privacy Policy -- links.dbowland.com</title>
      </Helmet>
      <main>
        <Grid sx={{ padding: { sm: '50px', xs: '25px 10px' } }}>
          <Paper elevation={3} sx={{ margin: 'auto', maxWidth: '900px' }}>
            <PrivacyPolicy />
          </Paper>
        </Grid>
      </main>
    </Paper>
  )
}

export default PrivacyPage
