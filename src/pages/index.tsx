import Grid from '@mui/material/Grid'
import { Helmet } from 'react-helmet'
import React from 'react'

import LinkCreate from '@components/link-create'

const Index = (): JSX.Element => {
  // This funky next line gets us to 100% test coverage (no difficult-to-test ternary where window needs to be undefined)
  const to = (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('to')) || undefined

  return (
    <main>
      <Helmet>
        <title>URL Shortener | dbowland.com</title>
      </Helmet>
      <Grid sx={{ padding: { sm: '50px', xs: '25px 10px' } }}>
        <LinkCreate to={to}></LinkCreate>
      </Grid>
    </main>
  )
}

export default Index
