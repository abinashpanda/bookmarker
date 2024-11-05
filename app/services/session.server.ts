// app/services/session.server.ts
import { createCookieSessionStorage } from '@remix-run/node'
import { Resource } from 'sst'

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [Resource['BOOKMARKER_AUTH_SECRET'].value],
    secure: process.env.NODE_ENV === 'production',
  },
})

export const { getSession, commitSession, destroySession } = sessionStorage
