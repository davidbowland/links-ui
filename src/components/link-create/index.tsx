import { Auth } from 'aws-amplify'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
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

  const generateShortenedUrl = async () => {
    try {
      const protocol = new URL(url).protocol
      if (protocol.match(/^https?:$/i) === null) {
        setErrorMessage('URL must be http or https')
        return
      }
    } catch (error) {
      setErrorMessage('Invalid URL')
      return
    }

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

  const generateAlerts = () => {
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
            variant="filled"
            type="text"
            fullWidth
            label="Shortened URL"
            name="shortened-url"
            value={shortenedUrl}
          />
        </label>
        <p>
          <Button variant="contained" fullWidth onClick={copyShortenedUrl}>
            Copy shortened URL
          </Button>
        </p>
        {textButtonVisible && (
          <p>
            <Button
              variant="outlined"
              fullWidth
              onClick={sendLinkByText}
              data-amplify-analytics-on="click"
              data-amplify-analytics-name="text-link-click"
            >
              Text me the link
            </Button>
          </p>
        )}
        <p>
          <Button variant="outlined" fullWidth onClick={newLink}>
            Generate different link
          </Button>
        </p>
      </>
    )
  }

  return (
    <>
      {generateAlerts()}
      <label>
        <TextField
          variant="filled"
          type="text"
          fullWidth
          label="Target URL"
          disabled={isLoading}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUrl(event.target.value)}
          name="update-url"
          value={url}
        />
      </label>
      <p>
        <Button
          variant="contained"
          fullWidth
          disabled={isLoading}
          onClick={generateShortenedUrl}
          data-amplify-analytics-on="click"
          data-amplify-analytics-name="generate-link-click"
        >
          {isLoading ? 'Loading...' : 'Generate shortened URL'}
        </Button>
      </p>
    </>
  )
}

export default LinkCreate
