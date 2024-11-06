import { prisma } from '@/services/db.server'
import { redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.slug, 'slug should be defined')
  const workspace = await prisma.workspace.findUnique({ where: { slug: params.slug } })
  if (!workspace) {
    return redirect('/404', { status: 404 })
  }
  return workspace
}

export default function WorkspacePage() {
  const workspace = useLoaderData<typeof loader>()

  return (
    <div>
      <div className="mb-2 text-3xl font-medium">{workspace.name}</div>
      <div>All your bookmarks</div>
    </div>
  )
}
