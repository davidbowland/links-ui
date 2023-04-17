import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import React from 'react'

import * as linkService from '@services/links'
import { link, linkId } from '@test/__mocks__'
import Redirect from './index'

jest.mock('@aws-amplify/analytics')
jest.mock('@services/links')

describe('Redirect component', () => {
  const consoleError = console.error
  const mockLocationReplace = jest.fn()
  const windowLocationReplace = window.location.replace

  beforeAll(() => {
    console.error = jest.fn()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { replace: mockLocationReplace },
    })

    mocked(linkService).fetchLink.mockResolvedValue(link)
  })

  afterAll(() => {
    console.error = consoleError
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { replace: windowLocationReplace },
    })
  })

  test('expect rendering Redirect has redirect message', async () => {
    render(<Redirect linkId={linkId} />)

    expect(screen.getByText(/Redirection in progress/i)).toBeInTheDocument()
    expect(await screen.findByText(/Redirecting you to/i)).toBeInTheDocument()
  })

  test('expect window location assigned and message when URL fetched', async () => {
    render(<Redirect linkId={linkId} />)

    expect(await screen.findByText(/Redirecting you to/i)).toBeInTheDocument()
    expect(await screen.findByText(/https:\/\/dbowland.com\//i)).toBeInTheDocument()
  })

  test('expect window location assigned and message when URL fetch rejects', async () => {
    mocked(linkService).fetchLink.mockRejectedValueOnce(undefined)
    render(<Redirect linkId={linkId} />)

    expect(await screen.findByText(/URL has expired/i)).toBeInTheDocument()
  })
})
