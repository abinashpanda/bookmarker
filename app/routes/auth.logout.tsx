import { authenticator } from '@/services/auth.server'
import { ActionFunctionArgs } from '@remix-run/node'

export async function action({ request }: ActionFunctionArgs) {
  return authenticator.logout(request, { redirectTo: '/login' })
}
