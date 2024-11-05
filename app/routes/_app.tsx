import { Outlet } from '@remix-run/react'
import { authenticator } from '@/services/auth.server'
import { redirect, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const isAuthenticated = await authenticator.isAuthenticated(request)
  if (!isAuthenticated) {
    return redirect('/login')
  }
  return {}
}

export default function AppLayout() {
  return <Outlet />
}
