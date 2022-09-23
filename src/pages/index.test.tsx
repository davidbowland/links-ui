import '@testing-library/jest-dom'
import React from 'react'
import { mocked } from 'jest-mock'
import { render } from '@testing-library/react'

import Index from './index'
import LinkCreate from '@components/link-create'
import PrivacyLink from '@components/privacy-link'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/link-create')
jest.mock('@components/privacy-link')

describe('Index page', () => {
  beforeAll(() => {
    mocked(LinkCreate).mockReturnValue(<></>)
    mocked(PrivacyLink).mockReturnValue(<></>)
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { search: '' },
    })
  })

  beforeEach(() => {
    window.location.search = ''
  })

  test('expect rendering Index renders LinkCreate', () => {
    render(<Index />)
    expect(mocked(LinkCreate)).toHaveBeenCalledWith({ to: undefined }, {})
  })

  test('expect "to" query string passed to LinkCreate', () => {
    window.location.search = '?to=https%3A%2F%2Fdbowland.com%2F'
    render(<Index />)
    expect(mocked(LinkCreate)).toHaveBeenCalledWith({ to: 'https://dbowland.com/' }, {})
  })

  test('expect rendering Index renders PrivacyLink', () => {
    render(<Index />)
    expect(mocked(PrivacyLink)).toHaveBeenCalledTimes(1)
  })
})
