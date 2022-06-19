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
      <section style={{ padding: '50px' }}>
        <Redirect linkId={params.linkId} />
      </section>
    </main>
  )
}

export default RedirectPage
