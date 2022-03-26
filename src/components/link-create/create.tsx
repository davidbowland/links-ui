import React, { useEffect, useState } from 'react'
import { Auth } from 'aws-amplify'
import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'

import Alerts from './alerts'
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
      setErrorMessage(undefined)
      setUrl('')
    } catch (error) {
      console.error('generateShortenedUrl', error)
      setErrorMessage('Error generating shortened URL, please try again later')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(() => setIsLoggedIn(true))
      .catch(() => null)
  }, [])

  return (
    <>
      <Alerts errorMessage={errorMessage} />
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
      {!isLoggedIn && <p style={{ textAlign: 'center' }}>Sign in to text yourself your shortened URL</p>}
      <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme: any) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default Create
