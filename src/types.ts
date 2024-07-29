export { AmplifyUser } from '@aws-amplify/ui'
export { Operation as PatchOperation } from 'fast-json-patch'
export { Theme } from '@mui/material/styles'

export type AuthState = 'signIn' | 'signUp' | 'resetPassword'

export interface Link {
  accessCount: number
  expiration?: number
  lastAccessed?: number
  url: string
}

export interface LinkBatch {
  [key: string]: Link
}

export interface StringObject {
  [key: string]: string
}
