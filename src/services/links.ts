import { API } from 'aws-amplify'
import { apiNameUnauthenticated } from '@config/amplify'
import { Link, StringObject } from '@types'

export const fetchLink = async (linkId: string): Promise<Link> =>
  API.get(apiNameUnauthenticated, `/links/${linkId}`, {})

export const createLink = async (url: string): Promise<StringObject> =>
  API.post(apiNameUnauthenticated, '/links', { body: { url } })
