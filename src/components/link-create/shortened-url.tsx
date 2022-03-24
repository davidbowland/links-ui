import { Auth } from 'aws-amplify'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import React, { useEffect, useState } from 'react'

import Alerts from './alerts'
import { textLink } from '@services/links'

export interface ShortenedUrlProps {
  linkId: string
  setLinkId: (value: string | undefined) => void
}

const ShortenedUrl = ({ linkId, setLinkId }: ShortenedUrlProps): JSX.Element => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const [shortenedUrl, setShortenedUrl] = useState<string | undefined>(undefined)
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
  const [textButtonVisible, setTextButtonVisible] = useState(false)

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

  const newLink = () => {
    setErrorMessage(undefined)
    setLinkId(undefined)
    setShortenedUrl(undefined)
    setSuccessMessage(undefined)
    setTextButtonVisible(false)
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
      <Alerts errorMessage={errorMessage} successMessage={successMessage} />
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

export default ShortenedUrl
