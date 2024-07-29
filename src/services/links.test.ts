import { Auth } from 'aws-amplify'
import { CognitoUserSession } from 'amazon-cognito-identity-js'

import { createLink, fetchLink, textLink } from './links'
import { http, HttpResponse, server } from '@test/setup-server'
import { link, linkId } from '@test/__mocks__'

const baseUrl = process.env.GATSBY_LINK_API_BASE_URL
jest.mock('@aws-amplify/analytics')

describe('Link service', () => {
  beforeAll(() => {
    const userSession = { getIdToken: () => ({ getJwtToken: () => '' }) } as CognitoUserSession
    jest.spyOn(Auth, 'currentSession').mockResolvedValue(userSession)
  })

  describe('createLink', () => {
    const postEndpoint = jest.fn().mockReturnValue(link)

    beforeAll(() => {
      server.use(
        http.post(`${baseUrl}/links`, async ({ request }) => {
          const body = postEndpoint(await request.json())
          return body ? HttpResponse.json(body) : new HttpResponse(null, { status: 400 })
        })
      )
    })

    test('expect endpoint called with link', async () => {
      await createLink(link.url)
      expect(postEndpoint).toHaveBeenCalledWith(expect.objectContaining({ url: link.url }))
    })

    test('expect result from call returned', async () => {
      const expectedResult = { id: '148' }
      postEndpoint.mockReturnValue(expectedResult)

      const result = await createLink(link.url)
      expect(postEndpoint).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('fetchLink', () => {
    beforeAll(() => {
      server.use(
        http.get(`${baseUrl}/links/:id`, async ({ params }) => {
          const { id } = params
          if (id !== linkId) {
            return new HttpResponse(null, { status: 400 })
          }
          return HttpResponse.json(link)
        })
      )
    })

    test('expect results from returned on fetch', async () => {
      const result = await fetchLink(linkId)
      expect(result).toEqual(link)
    })
  })

  describe('textLink', () => {
    const postEndpoint = jest.fn().mockReturnValue({})

    beforeAll(() => {
      server.use(
        http.post(`${baseUrl}/links/:id/send-text`, async ({ params, request }) => {
          const { id } = params
          if (id !== linkId) {
            return new HttpResponse(null, { status: 400 })
          }
          const body = postEndpoint(await request.json())
          return body ? HttpResponse.json(body) : new HttpResponse(null, { status: 400 })
        })
      )
    })

    test('expect endpoint called with body', async () => {
      await textLink(linkId)
      expect(postEndpoint).toHaveBeenCalledWith({})
    })
  })
})
