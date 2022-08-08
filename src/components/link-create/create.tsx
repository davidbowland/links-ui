import React, { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import { Auth } from 'aws-amplify'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

import { createLink } from '@services/links'

export interface CreateProps {
  setLinkId: (value: string | undefined) => void
  to?: string
}

const Create = ({ setLinkId, to }: CreateProps): JSX.Element => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [url, setUrl] = useState(to ?? '')
  const [urlError, setUrlError] = useState<string | undefined>(undefined)

  const generateShortenedUrl = async (): Promise<void> => {
    try {
      const protocol = new URL(url).protocol
      if (protocol.match(/^https?:$/i) === null) {
        setUrlError('URL must be http or https')
        return
      }
    } catch (error) {
      setUrlError('Invalid URL')
      return
    }
    setUrlError(undefined)

    setIsLoading(true)
    try {
      const newLink = await createLink(url)
      setLinkId(newLink.linkId)
      setErrorMessage(undefined)
      setUrl('')
    } catch (error) {
      console.error('generateShortenedUrl', error)
      setErrorMessage('Error generating shortened URL, please try again later')
    }
    setIsLoading(false)
  }

  const snackbarErrorClose = (): void => {
    setErrorMessage(undefined)
  }

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(() => setIsLoggedIn(true))
      .catch(() => null)
  }, [])

  return (
    <>
      <Stack spacing={2}>
        <label>
          <TextField
            disabled={isLoading}
            error={urlError !== undefined}
            fullWidth
            helperText={urlError}
            label="Target URL"
            name="update-url"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUrl(event.target.value)}
            type="text"
            value={url}
            variant="filled"
          />
        </label>
        <Button
          data-amplify-analytics-name="generate-link-click"
          data-amplify-analytics-on="click"
          disabled={isLoading}
          fullWidth
          onClick={generateShortenedUrl}
          startIcon={isLoading ? <CircularProgress color="inherit" size={14} /> : null}
          variant="contained"
        >
          {isLoading ? 'Loading...' : 'Generate shortened URL'}
        </Button>
        {!isLoggedIn && <p style={{ textAlign: 'center' }}>Sign in to text yourself your shortened URL</p>}
      </Stack>
      <Snackbar autoHideDuration={15_000} onClose={snackbarErrorClose} open={errorMessage !== undefined}>
        <Alert onClose={snackbarErrorClose} severity="error" variant="filled">
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Create
