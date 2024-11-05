import { Authenticator } from 'remix-auth'
import { GoogleStrategy } from 'remix-auth-google'
import { User } from '@prisma/client'
import { Resource } from 'sst/resource'
import { sessionStorage } from './session.server'
import { prisma } from './db.server'

export const authenticator = new Authenticator<User>(sessionStorage)
const googleStrategy = new GoogleStrategy(
  {
    clientID: Resource['BOOKMARKER_GOOGLE_CLIENT_ID'].value,
    clientSecret: Resource['BOOKMARKER_GOOGLE_CLIENT_SECRET'].value,
    callbackURL: import.meta.env.DEV
      ? '/auth/google/callback'
      : 'https://bookmarker.prodioslabs.com/auth/google/callback',
  },
  async ({ profile }) => {
    let user = await prisma.user.findUnique({ where: { email: profile.emails[0].value } })
    if (!user) {
      user = await prisma.user.create({
        data: { email: profile.emails[0].value, name: profile.displayName, photo: profile.photos?.[0]?.value },
      })
    }
    return user
  },
)
authenticator.use(googleStrategy)
