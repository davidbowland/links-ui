import { API } from 'aws-amplify'

import { apiName, apiNameUnauthenticated } from '@config/amplify'
import { Link, StringObject } from '@types'

export const createLink = (url: string): Promise<StringObject> =>
  API.post(apiNameUnauthenticated, '/links', { body: { url } })

export const fetchLink = (linkId: string): Promise<Link> => API.get(apiNameUnauthenticated, `/links/${linkId}`, {})

export const textLink = (linkId: string): Promise<StringObject> =>
  API.post(apiName, `/links/${encodeURIComponent(linkId)}/send-text`, { body: {} })
