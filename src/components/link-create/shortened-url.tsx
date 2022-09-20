import React, { useEffect, useState } from 'react'
import AddLinkIcon from '@mui/icons-material/AddLink'
import Alert from '@mui/material/Alert'
import { Auth } from 'aws-amplify'
import Button from '@mui/material/Button'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import TextsmsIcon from '@mui/icons-material/Textsms'
import Typography from '@mui/material/Typography'

import { textLink } from '@services/links'

export interface ShortenedUrlProps {
  linkId: string
  setLinkId: (value: string | undefined) => void
}

const ShortenedUrl = ({ linkId, setLinkId }: ShortenedUrlProps): JSX.Element => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const [shortenedUrl, setShortenedUrl] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
  const [textButtonVisible, setTextButtonVisible] = useState(false)

  const copyShortenedUrl = (): void => {
    try {
      navigator.clipboard.writeText(shortenedUrl)
      setSuccessMessage('Link copied to clipboard')
      setErrorMessage(undefined)
    } catch (error) {
      console.error('copyShortenedUrl', error)
      setErrorMessage('Could not copy link to clipboard')
    }
  }

  const newLink = (): void => {
    setErrorMessage(undefined)
    setLinkId(undefined)
    setShortenedUrl('')
    setSuccessMessage(undefined)
    setTextButtonVisible(false)
  }

  const sendLinkByText = async (): Promise<void> => {
    try {
      setTextButtonVisible(false)
      await textLink(linkId)
      setSuccessMessage('Check your text messages for the link')
    } catch (error) {
      console.error('sendLinkByText', error)
      setTextButtonVisible(true)
      setErrorMessage('Error texting link, please try again later')
    }
  }

  const snackbarErrorClose = (): void => {
    setErrorMessage(undefined)
  }

  const snackbarSuccessClose = (): void => {
    setSuccessMessage(undefined)
  }

  useEffect(() => {
    setShortenedUrl(`${window.location.origin}/r/${linkId}`)
  }, [linkId])

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(() => setTextButtonVisible(true))
      .catch(() => null)
  }, [])

  return (
    <>
      <Paper elevation={6} sx={{ margin: 'auto', maxWidth: 900 }}>
        <Stack spacing={2} sx={{ p: { sm: '25px', xs: '10px' }, textAlign: 'center' }}>
          <label>
            <TextField
              aria-readonly="true"
              fullWidth
              label="Shortened URL"
              name="shortened-url"
              type="text"
              value={shortenedUrl}
              variant="filled"
            />
          </label>
          <Typography variant="caption">Links automatically expire after 30 days</Typography>
          <Grid container spacing={2} sx={{ paddingRight: 2, width: '100%' }}>
            <Grid item xs={12}>
              <Button fullWidth onClick={copyShortenedUrl} startIcon={<ContentCopyIcon />} variant="contained">
                Copy URL
              </Button>
            </Grid>
            {textButtonVisible && (
              <Grid item sm={6} xs={12}>
                <Button
                  color="secondary"
                  data-amplify-analytics-name="text-link-click"
                  data-amplify-analytics-on="click"
                  fullWidth
                  onClick={sendLinkByText}
                  startIcon={<TextsmsIcon />}
                  variant="outlined"
                >
                  Text me the link
                </Button>
              </Grid>
            )}
            <Grid item sm xs={12}>
              <Button color="secondary" fullWidth onClick={newLink} startIcon={<AddLinkIcon />} variant="outlined">
                New link
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
      <Snackbar autoHideDuration={5_000} onClose={snackbarSuccessClose} open={successMessage !== undefined}>
        <Alert onClose={snackbarSuccessClose} severity="success" variant="filled">
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ShortenedUrl
