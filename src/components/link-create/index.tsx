import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import React, { useState } from 'react'

import { createLink } from '@services/links'

export interface LinkCreateProps {
  to?: string
}

const LinkCreate = ({ to }: LinkCreateProps): JSX.Element => {
  const [errorMessage, setErrorMessage] = useState(undefined as string | undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [shortLink, setShortLink] = useState(undefined as string | undefined)
  const [successMessage, setSuccessMessage] = useState(undefined as string | undefined)
  const [url, setUrl] = useState(to ?? '')

  const generateShortLink = async () => {
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
      setShortLink(`${window.location.origin}/r/${newLink.linkId}`)
      setErrorMessage(undefined)
    } catch (error) {
      console.error('generateShortLink', error)
      setErrorMessage('Error generating short link, please try again later')
    }
    setIsLoading(false)
  }

  const copyShortLink = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      navigator.clipboard.writeText(shortLink!)
      setSuccessMessage('Link copied to clipboard')
      setErrorMessage(undefined)
    } catch (err) {
      console.error('copyShortLink', err)
      setErrorMessage('Could not copy link to clipboard')
    }
  }

  const newLink = () => {
    setErrorMessage(undefined)
    setIsLoading(false)
    setShortLink(undefined)
    setSuccessMessage(undefined)
    setUrl('')
  }

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

  if (shortLink) {
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
            value={shortLink}
          />
        </label>
        <p>
          <Button variant="contained" fullWidth onClick={copyShortLink}>
            Copy short link
          </Button>
        </p>
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
        <Button variant="contained" fullWidth disabled={isLoading} onClick={generateShortLink}>
          {isLoading ? 'Loading...' : 'Generate short link'}
        </Button>
      </p>
    </>
  )
}

export default LinkCreate
