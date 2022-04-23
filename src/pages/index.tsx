import { Helmet } from 'react-helmet'
import Paper from '@mui/material/Paper'
import React from 'react'

import Authenticated from '@components/auth'
import LinkCreate from '@components/link-create'
import Themed from '@components/themed'

const Index = (): JSX.Element => {
  // This funky next line gets us to 100% test coverage (no difficult-to-test ternary where window needs to be undefined)
  const to = (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('to')) || undefined

  return (
    <Themed>
      <Helmet>
        <title>URL Shortener | dbowland.com</title>
      </Helmet>
      <Paper elevation={3} sx={{ margin: 'auto', maxWidth: '900px' }}>
        <Authenticated>
          <main className="main-content">
            <section>
              <LinkCreate to={to}></LinkCreate>
            </section>
          </main>
        </Authenticated>
      </Paper>
    </Themed>
  )
}

export default Index
