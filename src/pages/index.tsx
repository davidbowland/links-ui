import Container from '@mui/material/Container'
import { Helmet } from 'react-helmet'
import React from 'react'

import '@config/amplify'
import Authenticated from '@components/auth'
import LinkCreate from '@components/link-create'

import '@assets/css/index.css'
import '@fontsource/rokkitt'
import 'normalize.css'

const Index = (): JSX.Element => {
  // This funky next line gets us to 100% test coverage (no difficult-to-test ternary where window needs to be undefined)
  const to = (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('to')) || undefined

  return (
    <>
      <Helmet>
        <title>URL Shortener | dbowland.com</title>
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
