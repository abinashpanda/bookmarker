import { authenticator } from '@/services/auth.server'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  })
  return json({})
}

export default function Auth() {
  return <Outlet />
}
