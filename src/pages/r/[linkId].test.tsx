import '@testing-library/jest-dom'
import React from 'react'
import { mocked } from 'jest-mock'
import { render } from '@testing-library/react'

import Redirect from '@components/redirect'
import RedirectPage from './[linkId]'
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
