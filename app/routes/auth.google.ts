import { redirect, type ActionFunctionArgs } from '@remix-run/node'
import { authenticator } from '@/services/auth.server'

export const loader = () => redirect('/login')

export const action = ({ request }: ActionFunctionArgs) => {
  return authenticator.authenticate('google', request)
}

export default function GoogleAuth() {
  return null
}
