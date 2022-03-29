import '@testing-library/jest-dom'
import React from 'react'
import { mocked } from 'jest-mock'
import { render } from '@testing-library/react'

import Redirect from '@components/redirect'
import RedirectPage from './[linkId]'
import Themed from '@components/themed'
import { linkId } from '@test/__mocks__'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/redirect')
jest.mock('@components/themed')

describe('Redirect page', () => {
  beforeAll(() => {
    mocked(Redirect).mockReturnValue(<></>)
    mocked(Themed).mockImplementation(({ children }) => <>{children}</>)
  })

  test('expect rendering RedirectPage renders Redirect', () => {
    render(<RedirectPage params={{ linkId }} />)
    expect(mocked(Redirect)).toBeCalledWith({ linkId: 'aeio' }, {})
  })
})
