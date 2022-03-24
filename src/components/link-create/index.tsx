import React, { useState } from 'react'

import Create from './create'
import ShortenedUrl from './shortened-url'

export interface LinkCreateProps {
  to?: string
}

const LinkCreate = ({ to }: LinkCreateProps): JSX.Element => {
  const [linkId, setLinkId] = useState<string | undefined>(undefined)

  return linkId ? <ShortenedUrl linkId={linkId} setLinkId={setLinkId} /> : <Create setLinkId={setLinkId} to={to} />
}

export default LinkCreate
