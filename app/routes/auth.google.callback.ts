import type { LoaderFunctionArgs } from '@remix-run/node'
import { authenticator } from '@/services/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const result = await authenticator.authenticate('google', request, {
    successRedirect: '/',
    failureRedirect: '/login',
  })
  return result
}

export default function GoogleAuthCallback() {
  return null
}
