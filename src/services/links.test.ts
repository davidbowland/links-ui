import { Auth } from 'aws-amplify'
import { CognitoUserSession } from 'amazon-cognito-identity-js'

import { createLink, fetchLink } from './links'
import { link, linkId } from '@test/__mocks__'
import { rest, server } from '@test/setup-server'

const baseUrl = process.env.JOKE_API_BASE_URL || 'http://localhost'
jest.mock('@aws-amplify/analytics')

describe('Link service', () => {
  beforeAll(() => {
    const userSession = { getIdToken: () => ({ getJwtToken: () => '' }) } as CognitoUserSession
    jest.spyOn(Auth, 'currentSession').mockResolvedValue(userSession)
  })

  describe('createLink', () => {
    const postEndpoint = jest.fn().mockReturnValue(200)

    beforeAll(() => {
      server.use(
        rest.post(`${baseUrl}/links`, async (req, res, ctx) => {
          const body = postEndpoint(req.body)
          return res(body ? ctx.json(body) : ctx.status(400))
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
        rest.get(`${baseUrl}/links/:id`, async (req, res, ctx) => {
          const { id } = req.params
          if (id != linkId) {
            return res(ctx.status(400))
          }
          return res(ctx.json(link))
        })
      )
    })

    test('expect results from returned on fetch', async () => {
      const result = await fetchLink(linkId)
      expect(result).toEqual(link)
    })
  })
})
