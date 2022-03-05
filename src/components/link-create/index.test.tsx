import { Auth } from 'aws-amplify'
import { mocked } from 'jest-mock'
import React from 'react'
import '@testing-library/jest-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'

import LinkCreate from './index'
import * as linkService from '@services/links'
import { linkId, user } from '@test/__mocks__'

jest.mock('aws-amplify')
jest.mock('@aws-amplify/analytics')
jest.mock('@services/links')

describe('LinkCreate component', () => {
  const consoleError = console.error
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
      value: { origin: 'https://bowland.link' },
    })

    mocked(Auth).currentAuthenticatedUser.mockResolvedValue(user)
    mocked(linkService).createLink.mockResolvedValue({ linkId })
  })

  afterAll(() => {
    console.error = consoleError
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
      await act(async () => {
        await generateLinkButton.click()
      })

      expect(await screen.findByText(/Invalid URL/i)).toBeInTheDocument()
    })

    test('expect non-HTTP URL returns error message', async () => {
      render(<LinkCreate to="ftp://dbowland.com" />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      await act(async () => {
        await generateLinkButton.click()
      })

      expect(await screen.findByText(/URL must be http or https/i)).toBeInTheDocument()
    })

    test('expect URL is passed to createLink when generate button is clicked and Loading displayed', async () => {
      render(<LinkCreate />)

      const urlInput = (await screen.findByLabelText(/Target URL/i)) as HTMLInputElement
      act(() => {
        fireEvent.change(urlInput, { target: { value: url } })
      })

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      act(() => {
        generateLinkButton.click()
      })

      expect(mocked(linkService).createLink).toHaveBeenCalledWith(url)
      expect(await screen.findByText(/Loading\.\.\./i)).toBeInTheDocument()
    })

    test('expect error message when createLink rejects', async () => {
      mocked(linkService).createLink.mockRejectedValueOnce(undefined)
      render(<LinkCreate to={url} />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      await act(async () => {
        await generateLinkButton.click()
      })

      expect(await screen.findByText(/Error generating shortened URL, please try again later/i)).toBeInTheDocument()
    })
  })

  describe('shortened URL', () => {
    test('expect shortened URL is returned when createLink resolves', async () => {
      render(<LinkCreate to={url} />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      await act(async () => {
        await generateLinkButton.click()
      })

      const urlInput: HTMLInputElement = (await screen.findByLabelText(/Shortened URL/i)) as HTMLInputElement
      expect(urlInput.value).toEqual('https://bowland.link/r/aeio')
    })

    test('expect copy invokes writeText and displays message', async () => {
      render(<LinkCreate to={url} />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      await act(async () => {
        await generateLinkButton.click()
      })

      const copyLinkButton = (await screen.findByText(/Copy shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      act(() => {
        copyLinkButton.click()
      })

      expect(mockCopyToClipboard).toHaveBeenCalled()
      expect(await screen.findByText(/Link copied to clipboard/i)).toBeInTheDocument()
    })

    test('expect copy throw displays error', async () => {
      mockCopyToClipboard.mockImplementationOnce(() => {
        throw new Error('A wild error appeared')
      })
      render(<LinkCreate to={url} />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      await act(async () => {
        await generateLinkButton.click()
      })

      const copyLinkButton = (await screen.findByText(/Copy shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      act(() => {
        copyLinkButton.click()
      })

      expect(mockCopyToClipboard).toHaveBeenCalled()
      expect(await screen.findByText(/Could not copy link to clipboard/i)).toBeInTheDocument()
    })

    test('expect text option not visible when not logged in', async () => {
      mocked(Auth).currentAuthenticatedUser.mockRejectedValueOnce(undefined)
      render(<LinkCreate to={url} />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      await act(async () => {
        await generateLinkButton.click()
      })

      expect(() => screen.getByText(/Check your text messages for the link/i)).toThrow()
    })

    test('expect text invokes textLink and displays message', async () => {
      render(<LinkCreate to={url} />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      await act(async () => {
        await generateLinkButton.click()
      })

      const textLinkButton = (await screen.findByText(/Text me the link/i, {
        selector: 'button',
      })) as HTMLButtonElement
      act(() => {
        textLinkButton.click()
      })

      expect(mocked(linkService).textLink).toHaveBeenCalledWith(linkId)
      expect(await screen.findByText(/Check your text messages for the link/i)).toBeInTheDocument()
    })

    test('expect text throw displays error', async () => {
      mocked(linkService).textLink.mockRejectedValueOnce('A wild error appeared')
      render(<LinkCreate to={url} />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      await act(async () => {
        await generateLinkButton.click()
      })

      const textLinkButton = (await screen.findByText(/Text me the link/i, {
        selector: 'button',
      })) as HTMLButtonElement
      act(() => {
        textLinkButton.click()
      })

      expect(await screen.findByText(/Error texting link, please try again later/i)).toBeInTheDocument()
    })

    test('expect a return to the link input when returning from shortened URL', async () => {
      render(<LinkCreate to={url} />)

      const generateLinkButton = (await screen.findByText(/Generate shortened URL/i, {
        selector: 'button',
      })) as HTMLButtonElement
      await act(async () => {
        await generateLinkButton.click()
      })

      const newLinkButton = (await screen.findByText(/Generate different link/i, {
        selector: 'button',
      })) as HTMLButtonElement
      act(() => {
        newLinkButton.click()
      })

      expect(await screen.findByLabelText(/Target URL/i)).toBeInTheDocument()
      expect(await screen.findByText(/Generate shortened URL/i, { selector: 'button' })).toBeInTheDocument()
    })
  })
})
