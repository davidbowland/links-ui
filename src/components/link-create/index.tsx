import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import React, { useState } from 'react'

import { createLink } from '@services/links'

export interface LinkCreateProps {
  to?: string
}

const LinkCreate = ({ to }: LinkCreateProps): JSX.Element => {
  const [error, setError] = useState(undefined as string | undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [shortLink, setShortLink] = useState(undefined as string | undefined)
  const [success, setSuccess] = useState(undefined as string | undefined)
  const [url, setUrl] = useState(to ?? '')

  const generateShortLink = async () => {
    try {
      setIsLoading(true)
      const newLink = await createLink(url)
      setShortLink(`${window.location.origin}/r/${newLink.linkId}`)
      setError(undefined)
      setIsLoading(false)
    } catch (err) {
      console.error('generateShortLink', err)
      setError('Error generating short link, please try again later')
      setIsLoading(false)
    }
  }

  const copyShortLink = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      navigator.clipboard.writeText(shortLink!)
      setSuccess('Link copied to clipboard')
      setError(undefined)
    } catch (err) {
      console.error('copyShortLink', err)
      setError('Could not copy link to clipboard')
    }
  }

  const newLink = () => {
    setError(undefined)
    setIsLoading(false)
    setShortLink(undefined)
    setSuccess(undefined)
    setUrl('')
  }

  const generateAlerts = () => {
    if (error) {
      return (
        <p>
          <Alert severity="error">{error}</Alert>
        </p>
      )
    } else if (success) {
      return (
        <p>
          <Alert severity="success">{success}</Alert>
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
