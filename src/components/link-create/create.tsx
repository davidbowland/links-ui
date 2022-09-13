import React, { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import { Auth } from 'aws-amplify'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

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
      <Grid container justifyContent="center">
        <Grid item sx={{ p: '0.5em' }} xs={12}>
          <label>
            <TextField
              disabled={isLoading}
              error={urlError !== undefined}
              fullWidth
              helperText={urlError}
              label="Target URL"
              name="update-url"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUrl(event.target.value)}
              sx={{ height: '100%' }}
              type="text"
              value={url}
              variant="filled"
            />
          </label>
        </Grid>
        <Grid item sm={6} sx={{ p: '0.5em' }} xs={12}>
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
        </Grid>
      </Grid>
      {!isLoggedIn && (
        <Typography style={{ textAlign: 'center' }}>Sign in to text yourself your shortened URL</Typography>
      )}
      <Snackbar autoHideDuration={15_000} onClose={snackbarErrorClose} open={errorMessage !== undefined}>
        <Alert onClose={snackbarErrorClose} severity="error" variant="filled">
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Create
