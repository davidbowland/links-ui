import { CognitoUserAmplify, Link } from '@types'

export const linkId = 'aeio'

export const link: Link = {
  accessCount: 7,
  expiration: 10000,
  lastAccessed: 1231441,
  url: 'https://dbowland.com/',
}

export const user: CognitoUserAmplify = ({
  attributes: {
    email: '',
    name: 'Steve',
    phone_number: '+1800JENNYCRAIG',
  },
} as unknown) as CognitoUserAmplify
