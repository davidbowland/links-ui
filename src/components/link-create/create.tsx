import React, { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import { Auth } from 'aws-amplify'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import LinkIcon from '@mui/icons-material/Link'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
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
      <Paper elevation={6} sx={{ margin: 'auto', maxWidth: 900 }}>
        <Stack spacing={2} sx={{ p: { sm: '25px', xs: '10px' }, textAlign: 'center' }}>
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
          {!isLoggedIn && (
            <Typography variant="caption">Sign in or sign up to text yourself your shortened URL</Typography>
          )}
          <Grid container justifyContent="center">
            <Grid item sm={6} xs={12}>
              <Button
                data-amplify-analytics-name="generate-link-click"
                data-amplify-analytics-on="click"
                disabled={isLoading}
                fullWidth
                onClick={generateShortenedUrl}
                startIcon={isLoading ? <CircularProgress color="inherit" size={14} /> : <LinkIcon />}
                variant="contained"
              >
                {isLoading ? 'Loading...' : 'Generate shortened URL'}
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Paper>
      <Snackbar autoHideDuration={15_000} onClose={snackbarErrorClose} open={errorMessage !== undefined}>
        <Alert onClose={snackbarErrorClose} severity="error" variant="filled">
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Create
