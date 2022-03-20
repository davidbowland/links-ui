import { Auth } from 'aws-amplify'
import Alert from '@mui/material/Alert'
import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import React, { useEffect, useState } from 'react'

import { createLink, textLink } from '@services/links'

export interface LinkCreateProps {
  to?: string
}

const LinkCreate = ({ to }: LinkCreateProps): JSX.Element => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [linkId, setLinkId] = useState<string | undefined>(undefined)
  const [shortenedUrl, setShortenedUrl] = useState<string | undefined>(undefined)
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
  const [textButtonVisible, setTextButtonVisible] = useState(false)
  const [url, setUrl] = useState(to ?? '')
  const [urlError, setUrlError] = useState<string | undefined>(undefined)

  const generateShortenedUrl = async () => {
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
      setShortenedUrl(`${window.location.origin}/r/${newLink.linkId}`)
      setErrorMessage(undefined)
    } catch (error) {
      console.error('generateShortenedUrl', error)
      setErrorMessage('Error generating shortened URL, please try again later')
    }
    setIsLoading(false)
  }

  const copyShortenedUrl = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      navigator.clipboard.writeText(shortenedUrl!)
      setSuccessMessage('Link copied to clipboard')
      setErrorMessage(undefined)
    } catch (error) {
      console.error('copyShortenedUrl', error)
      setErrorMessage('Could not copy link to clipboard')
    }
  }

  const sendLinkByText = async () => {
    try {
      setTextButtonVisible(false)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await textLink(linkId!)
      setSuccessMessage('Check your text messages for the link')
    } catch (error) {
      console.error('sendLinkByText', error)
      setTextButtonVisible(true)
      setErrorMessage('Error texting link, please try again later')
    }
  }

  const newLink = () => {
    setErrorMessage(undefined)
    setIsLoading(false)
    setLinkId(undefined)
    setShortenedUrl(undefined)
    setSuccessMessage(undefined)
    setTextButtonVisible(false)
    setUrl('')
  }

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(() => setTextButtonVisible(true))
      .catch(() => null)
  }, [])

  const generateAlerts = (): JSX.Element | null => {
    if (errorMessage) {
      return (
        <p>
          <Alert severity="error">{errorMessage}</Alert>
        </p>
      )
    } else if (successMessage) {
      return (
        <p>
          <Alert severity="success">{successMessage}</Alert>
        </p>
      )
    }
    return null
  }

  if (shortenedUrl) {
    return (
      <>
        {generateAlerts()}
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
        <p>
          <Button fullWidth onClick={copyShortenedUrl} variant="contained">
            Copy shortened URL
          </Button>
        </p>
        {textButtonVisible && (
          <p>
            <Button
              data-amplify-analytics-name="text-link-click"
              data-amplify-analytics-on="click"
              fullWidth
              onClick={sendLinkByText}
              variant="outlined"
            >
              Text me the link
            </Button>
          </p>
        )}
        <p>
          <Button fullWidth onClick={newLink} variant="outlined">
            Generate different link
          </Button>
        </p>
        <p style={{ textAlign: 'center' }}>Links automatically expire after 30 days</p>
      </>
    )
  }

  return (
    <>
      {generateAlerts()}
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
          variant="filled"
          value={url}
        />
      </label>
      <p>
        <Button
          data-amplify-analytics-name="generate-link-click"
          data-amplify-analytics-on="click"
          disabled={isLoading}
          fullWidth
          onClick={generateShortenedUrl}
          variant="contained"
        >
          {isLoading ? 'Loading...' : 'Generate shortened URL'}
        </Button>
      </p>
      {!textButtonVisible && <p style={{ textAlign: 'center' }}>Sign in to text yourself your shortened URL</p>}
      <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme: any) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default LinkCreate
