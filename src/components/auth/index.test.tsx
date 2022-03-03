import React from 'react'
import '@testing-library/jest-dom'
import { screen, render } from '@testing-library/react'

import Authenticated from './index'

jest.mock('@aws-amplify/analytics')
const mockSignOut = jest.fn()
jest.mock('@aws-amplify/ui-react', () => ({
  Authenticator: jest.fn().mockImplementation(({ children }) => children({ signOut: mockSignOut }) ?? null),
}))

describe('Authenticated component', () => {
  test('expect being logged in shows children and sign out button', async () => {
    render(
      <Authenticated>
        <p>Testing children</p>
      </Authenticated>
    )

    expect(await screen.findByText(/Sign out/i, { selector: 'button' })).toBeInTheDocument()
    expect(await screen.findByText(/Testing children/i)).toBeInTheDocument()
  })
})
