import Container from '@mui/material/Container'
import React from 'react'
import { Helmet } from 'react-helmet'

import Authenticated from '@components/auth'
import LinkCreate from '@components/link-create'

import '@config/amplify'
import '@fontsource/rokkitt'
import 'normalize.css'
import '@assets/css/index.css'

const Index = (): JSX.Element => {
  // This funky next line gets us to 100% test coverage (no difficult-to-test ternary where window needs to be undefined)
  const to = (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('to')) || undefined

  return (
    <Container maxWidth="md">
      <main className="main-content">
        <Helmet>
          <title>Short Link Generator | dbowland.com</title>
        </Helmet>
        <h1 className="main-heading">Short Link Generator</h1>
        <section>
          <Authenticated>
            <LinkCreate to={to}></LinkCreate>
          </Authenticated>
        </section>
      </main>
    </Container>
  )
}

export default Index
