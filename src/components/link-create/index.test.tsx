import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Auth } from 'aws-amplify'
import { mocked } from 'jest-mock'
import React from 'react'

import * as linkService from '@services/links'
import { linkId, user } from '@test/__mocks__'
import LinkCreate from './index'

jest.mock('aws-amplify')
jest.mock('@aws-amplify/analytics')
jest.mock('@services/links')

describe('LinkCreate component', () => {
  const mockCopyToClipboard = jest.fn()
  const url = 'https://dbowland.com/'

  beforeAll(() => {
    console.error = jest.fn()
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: mockCopyToClipboard },
    })
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { origin: 'https://dbowland.com' },
    })

    mocked(Auth).currentAuthenticatedUser.mockResolvedValue(user)
    mocked(linkService).createLink.mockResolvedValue({ linkId })
  })

  describe('URL input', () => {
    test('expect "to" value is passed to URL', async () => {
      render(<LinkCreate to={url} />)

      const urlInput = (await screen.findByLabelText(/Target URL/i)) as HTMLInputElement
      expect(urlInput.value).toEqual(url)
    })

    test('expect URL is empty when "to" is undefined', async () => {
      render(<LinkCreate />)

      const urlInput = (await screen.findByLabelText(/Target URL/i)) as HTMLInputElement
      expect(urlInput.value.length).toEqual(0)
    })

    test('expect invalid URL returns error message', async () => {
      render(<LinkCreate to="invalid-url" />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      fireEvent.click(generateLinkButton)

      expect(await screen.findByText(/Invalid URL/i)).toBeInTheDocument()
    })

    test('expect non-HTTP URL returns error message', async () => {
      render(<LinkCreate to="ftp://dbowland.com" />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      fireEvent.click(generateLinkButton)

      expect(await screen.findByText(/URL must be http or https/i)).toBeInTheDocument()
    })

    test('expect URL is passed to createLink when generate button is clicked', async () => {
      render(<LinkCreate />)

      const urlInput = (await screen.findByLabelText(/Target URL/i)) as HTMLInputElement
      fireEvent.change(urlInput, { target: { value: url } })

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      fireEvent.click(generateLinkButton)

      expect(mocked(linkService).createLink).toHaveBeenCalledWith(url)
    })

    test('expect error message when createLink rejects', async () => {
      mocked(linkService).createLink.mockRejectedValueOnce(undefined)
      render(<LinkCreate to={url} />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      fireEvent.click(generateLinkButton)

      expect(await screen.findByText(/Error generating shortened URL, please try again later/i)).toBeInTheDocument()
    })

    test('expect closing error message removes it', async () => {
      mocked(linkService).createLink.mockRejectedValueOnce(undefined)
      render(<LinkCreate to={url} />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      fireEvent.click(generateLinkButton)
      const closeSnackbarButton = (await screen.findByLabelText(/Close/i, { selector: 'button' })) as HTMLButtonElement
      fireEvent.click(closeSnackbarButton)

      expect(screen.queryByText(/Error generating shortened URL, please try again later/i)).not.toBeInTheDocument()
    })
  })

  describe('shortened URL', () => {
    test('expect shortened URL is returned when createLink resolves', async () => {
      render(<LinkCreate to={url} />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      fireEvent.click(generateLinkButton)

      const urlInput: HTMLInputElement = (await screen.findByLabelText(/Shortened URL/i)) as HTMLInputElement
      await waitFor(() => {
        expect(urlInput.value).toEqual('https://dbowland.com/r/aeio')
      })
    })

    test('expect copy invokes writeText and displays message', async () => {
      render(<LinkCreate to={url} />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      fireEvent.click(generateLinkButton)
      const copyLinkButton = (await screen.findByText(/Copy URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      fireEvent.click(copyLinkButton)

      await waitFor(() => {
        expect(screen.queryByText(/Link copied to clipboard/i)).toBeInTheDocument()
      })
      expect(mockCopyToClipboard).toHaveBeenCalled()
    })

    test('expect closing success smessage removes it', async () => {
      render(<LinkCreate to={url} />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      fireEvent.click(generateLinkButton)
      const copyLinkButton = (await screen.findByText(/Copy URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      fireEvent.click(copyLinkButton)
      const closeSnackbarButton = (await screen.findByLabelText(/Close/i, { selector: 'button' })) as HTMLButtonElement
      fireEvent.click(closeSnackbarButton)

      expect(screen.queryByText(/Link copied to clipboard/i)).not.toBeInTheDocument()
    })

    test('expect copy throw displays error', async () => {
      mockCopyToClipboard.mockImplementationOnce(() => {
        throw new Error('A wild error appeared')
      })
      render(<LinkCreate to={url} />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      fireEvent.click(generateLinkButton)
      const copyLinkButton = (await screen.findByText(/Copy URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      fireEvent.click(copyLinkButton)

      expect(await screen.findByText(/Could not copy link to clipboard/i)).toBeInTheDocument()
      expect(mockCopyToClipboard).toHaveBeenCalled()
    })

    test('expect closing error message removes it', async () => {
      mockCopyToClipboard.mockImplementationOnce(() => {
        throw new Error('A wild error appeared')
      })
      render(<LinkCreate to={url} />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      fireEvent.click(generateLinkButton)
      const copyLinkButton = (await screen.findByText(/Copy URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      fireEvent.click(copyLinkButton)
      const closeSnackbarButton = (await screen.findByLabelText(/Close/i, { selector: 'button' })) as HTMLButtonElement
      fireEvent.click(closeSnackbarButton)

      expect(screen.queryByText(/Could not copy link to clipboard/i)).not.toBeInTheDocument()
    })

    test('expect text option not visible when not logged in', async () => {
      mocked(Auth).currentAuthenticatedUser.mockRejectedValueOnce(undefined)
      mocked(Auth).currentAuthenticatedUser.mockRejectedValueOnce(undefined)
      render(<LinkCreate to={url} />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      fireEvent.click(generateLinkButton)

      expect(screen.queryByText(/Check your text messages for the link/i)).not.toBeInTheDocument()
    })

    test('expect text invokes textLink and displays message', async () => {
      render(<LinkCreate to={url} />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      fireEvent.click(generateLinkButton)
      const textLinkButton = (await screen.findByText(/Text me the link/i, {
        selector: 'button',
      })) as HTMLButtonElement
      fireEvent.click(textLinkButton)

      expect(await screen.findByText(/Check your text messages for the link/i)).toBeInTheDocument()
      expect(mocked(linkService).textLink).toHaveBeenCalledWith(linkId)
    })

    test('expect text throw displays error', async () => {
      mocked(linkService).textLink.mockRejectedValueOnce('A wild error appeared')
      render(<LinkCreate to={url} />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      fireEvent.click(generateLinkButton)
      const textLinkButton = (await screen.findByText(/Text me the link/i, {
        selector: 'button',
      })) as HTMLButtonElement
      fireEvent.click(textLinkButton)

      expect(await screen.findByText(/Error texting link, please try again later/i)).toBeInTheDocument()
    })

    test('expect a return to the link input when returning from shortened URL', async () => {
      render(<LinkCreate to={url} />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      fireEvent.click(generateLinkButton)
      const newLinkButton = (await screen.findByText(/New link/i, {
        selector: 'button',
      })) as HTMLButtonElement
      fireEvent.click(newLinkButton)

      expect(await screen.findByLabelText(/Target URL/i)).toBeInTheDocument()
      expect(await screen.findByText(/Generate shortened URL/i, { selector: 'button' })).toBeInTheDocument()
    })
  })
})
