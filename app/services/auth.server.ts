import { Authenticator } from 'remix-auth'
import { sessionStorage } from '@/services/session.server'
import { GoogleStrategy } from 'remix-auth-google'
import { env } from '@/lib/env'
import { User } from '@prisma/client'
import { prisma } from './db.server'

export const authenticator = new Authenticator<User>(sessionStorage)
const googleStrategy = new GoogleStrategy(
  {
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
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
