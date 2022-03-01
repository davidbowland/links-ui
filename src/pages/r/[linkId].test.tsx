import { mocked } from 'jest-mock'
import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

import RedirectPage from './[linkId]'
import Redirect from '@components/redirect'
import { linkId } from '@test/__mocks__'

jest.mock('@aws-amplify/analytics')
jest.mock('@components/redirect')

describe('Redirect page', () => {
  beforeAll(() => {
    mocked(Redirect).mockReturnValue(<></>)
  })

  test('expect rendering RedirectPage renders Redirect', () => {
    render(<RedirectPage params={{ linkId }} />)
    expect(mocked(Redirect)).toBeCalledWith({ linkId: 'aeio' }, {})
  })
})
