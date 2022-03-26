import '@testing-library/jest-dom'
import React from 'react'
import { mocked } from 'jest-mock'
import { render } from '@testing-library/react'

import NotFound from './404'
import ServerErrorMessage from '@components/server-error-message'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/server-error-message')

describe('404 error page', () => {
  beforeAll(() => {
    mocked(ServerErrorMessage).mockReturnValue(<></>)
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { pathname: '' },
    })
  })

  beforeEach(() => {
    window.location.pathname = '/an-invalid-page'
  })

  test('expect rendering NotFound renders ServerErrorMessage', () => {
    const expectedTitle = '404: Not Found'
    render(<NotFound />)
    expect(mocked(ServerErrorMessage)).toHaveBeenCalledWith(
      expect.objectContaining({ title: expectedTitle }),
      expect.anything()
    )
    expect(mocked(ServerErrorMessage)).toHaveBeenCalledTimes(1)
  })

  test('expect no render when path begins /r/', () => {
    window.location.pathname = '/r/aeiou'
    render(<NotFound />)
    expect(mocked(ServerErrorMessage)).toHaveBeenCalledTimes(0)
  })

  test('expect render when pathname has three slashes', () => {
    window.location.pathname = '/r/aeiou/y'
    render(<NotFound />)
    expect(mocked(ServerErrorMessage)).toHaveBeenCalledTimes(1)
  })
})
