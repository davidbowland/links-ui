import { Helmet } from 'react-helmet'
import React from 'react'

import Redirect, { RedirectProps } from '@components/redirect'

export interface RedirectPageProps {
  params: RedirectProps
}

const RedirectPage = ({ params }: RedirectPageProps): JSX.Element => {
  return (
    <>
      <Helmet>
        <title>Links Redirect | dbowland.com</title>
      </Helmet>
      <main className="main-content">
        <Redirect linkId={params.linkId} />
      </main>
    </>
  )
}

export default RedirectPage
