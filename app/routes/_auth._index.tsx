import { authenticator } from '@/services/auth.server'
import { prisma } from '@/services/db.server'
import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)
  invariant(user, 'user should be authenticated')
  const userWorkspaces = await prisma.workspaceUserAssociation.findMany({
    where: { userId: user.id },
    include: { workspace: true },
  })
  if (userWorkspaces.length === 0) {
    return redirect('/onboarding')
  }
  return redirect(`/w/${userWorkspaces[0].workspace.slug}`)
}

export default function Home() {
  return null
}
