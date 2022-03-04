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
    <>
      <Helmet>
        <title>Short Link Generator | dbowland.com</title>
      </Helmet>
      <Container maxWidth="md">
        <Authenticated>
          <main className="main-content">
            <section>
              <LinkCreate to={to}></LinkCreate>
            </section>
          </main>
        </Authenticated>
      </Container>
    </>
  )
}

export default Index
