import { Amplify, Auth } from 'aws-amplify'
import { Analytics } from '@aws-amplify/analytics'

const appClientId = process.env.GATSBY_COGNITO_APP_CLIENT_ID
const userPoolId = process.env.GATSBY_COGNITO_USER_POOL_ID
const identityPoolId = process.env.GATSBY_IDENTITY_POOL_ID
const baseUrl = process.env.GATSBY_LINK_API_BASE_URL

// Authorization

export const apiName = 'LinksAPIGateway'
export const apiNameUnauthenticated = 'LinksAPIGatewayUnauthenticated'

Amplify.configure({
  Auth: {
    identityPoolId,
    region: userPoolId.split('_')[0],
    userPoolId,
    userPoolWebClientId: appClientId,
    mandatorySignIn: false,
  },
  API: {
    endpoints: [
      {
        name: apiName,
        endpoint: baseUrl,
        custom_header: async () => ({
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        }),
      },
      {
        name: apiNameUnauthenticated,
        endpoint: baseUrl,
      },
    ],
  },
})

// Analytics

const appId = process.env.GATSBY_PINPOINT_ID

const analyticsConfig = {
  AWSPinpoint: {
    appId,
    region: 'us-east-1',
    mandatorySignIn: false,
  },
}

Analytics.configure(analyticsConfig)

Analytics.autoTrack('session', {
  // REQUIRED, turn on/off the auto tracking
  enable: true,
})

Analytics.autoTrack('pageView', {
  // REQUIRED, turn on/off the auto tracking
  enable: true,
})

Analytics.autoTrack('event', {
  // REQUIRED, turn on/off the auto tracking
  enable: true,
})
