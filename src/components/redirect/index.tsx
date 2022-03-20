import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { Link } from 'gatsby'
import React, { useEffect, useState } from 'react'

import { fetchLink } from '@services/links'

export interface RedirectProps {
  linkId: string
}

const Redirect = ({ linkId }: RedirectProps): JSX.Element => {
  const [error, setError] = useState<string | undefined>(undefined)
  const [url, setUrl] = useState<string | undefined>(undefined)

  const fetchAndSetUrl = async (id: string): Promise<void> => {
    try {
      const result = await fetchLink(id)
      setUrl(result.url)
    } catch (error) {
      console.error('fetchAndSetUrl', error)
      setError('URL has expired.')
    }
  }

  useEffect(() => {
    if (url) {
      window.location.replace(url)
    }
  }, [url])

  useEffect(() => {
    fetchAndSetUrl(linkId)
  })

  if (error) {
    return (
      <Alert severity="error">
        {error} Return to <Link to={window.location.origin}>{window.location.origin}</Link>
      </Alert>
    )
  }
  if (url) {
    return (
      <Alert severity="success">
        Redirecting you to <Link to={url}>{url}</Link>
      </Alert>
    )
  }
  return (
    <>
      <Alert severity="info">Redirection in progress</Alert>
      <p style={{ textAlign: 'center' }}>
        <CircularProgress color="inherit" />
      </p>
    </>
  )
}

export default Redirect
