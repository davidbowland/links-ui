import { mocked } from 'jest-mock'
import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

import Index from './index'
import Authenticated from '@components/auth'
import LinkCreate from '@components/link-create'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/auth')
jest.mock('@components/link-create')

describe('Index page', () => {
  beforeAll(() => {
    mocked(Authenticated).mockImplementation(({ children }) => <>{children}</>)
    mocked(LinkCreate).mockReturnValue(<></>)
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { search: '' },
    })
  })

  beforeEach(() => {
    window.location.search = ''
  })

  test('expect rendering Index renders Authenticated', () => {
    render(<Index />)
    expect(mocked(Authenticated)).toHaveBeenCalled()
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
