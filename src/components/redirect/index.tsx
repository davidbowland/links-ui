import React, { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import { Link } from 'gatsby'
import Stack from '@mui/material/Stack'

import { fetchLink } from '@services/links'

export interface RedirectProps {
  linkId: string
}

const Redirect = ({ linkId }: RedirectProps): JSX.Element => {
  const [error, setError] = useState<string | undefined>()
  const [url, setUrl] = useState<string | undefined>()

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
      <Alert severity="error" variant="filled">
        {error} Return to <Link to={window.location.origin}>{window.location.origin}</Link>
      </Alert>
    )
  }
  if (url) {
    return (
      <Stack spacing={4}>
        <Alert severity="success" variant="filled">
          Redirecting you to <Link to={url}>{url}</Link>
        </Alert>
        <Box sx={{ width: '100%' }}>
          <LinearProgress color="success" />
        </Box>
      </Stack>
    )
  }
  return (
    <Stack spacing={4}>
      <Alert severity="info" variant="filled">
        Redirection in progress
      </Alert>
      <Box sx={{ width: '100%' }}>
        <LinearProgress color="info" />
      </Box>
    </Stack>
  )
}

export default Redirect
