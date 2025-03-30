import { API, Auth } from 'aws-amplify'
import { CognitoUserSession } from 'amazon-cognito-identity-js'

import { createLink, fetchLink, textLink } from './links'
import { link, linkId } from '@test/__mocks__'

jest.mock('@aws-amplify/analytics')
jest.mock('aws-amplify')

describe('Link service', () => {
  beforeAll(() => {
    const userSession = { getIdToken: () => ({ getJwtToken: () => '' }) } as CognitoUserSession
    jest.mocked(Auth).currentSession.mockResolvedValue(userSession)
  })

  describe('createLink', () => {
    beforeAll(() => {
      jest.mocked(API).post.mockResolvedValue(link)
    })

    test('expect endpoint called with link', async () => {
      await createLink(link.url)
      expect(API.post).toHaveBeenCalledWith('LinksAPIGatewayUnauthenticated', '/links', {
        body: { url: 'https://dbowland.com/' },
      })
    })

    test('expect result from call returned', async () => {
      const expectedResult = { id: '148' }
      jest.mocked(API).post.mockResolvedValueOnce({ id: '148' })

      const result = await createLink(link.url)
      expect(API.post).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('fetchLink', () => {
    beforeAll(() => {
      jest.mocked(API).get.mockResolvedValue(link)
    })

    test('expect results from returned on fetch', async () => {
      const result = await fetchLink(linkId)
      expect(result).toEqual(link)
    })
  })

  describe('textLink', () => {
    test('expect endpoint called with body', async () => {
      await textLink(linkId)
      expect(API.post).toHaveBeenCalledWith('LinksAPIGateway', '/links/aeio/send-text', { body: {} })
    })
  })
})
