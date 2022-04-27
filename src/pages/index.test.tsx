import '@testing-library/jest-dom'
import React from 'react'
import { mocked } from 'jest-mock'
import { render } from '@testing-library/react'

import Index from './index'
import LinkCreate from '@components/link-create'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/link-create')

describe('Index page', () => {
  beforeAll(() => {
    mocked(LinkCreate).mockReturnValue(<></>)
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
})
