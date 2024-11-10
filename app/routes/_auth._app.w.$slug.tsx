import { prisma } from '@/services/db.server'
import { redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { PackageSearchIcon } from 'lucide-react'
import invariant from 'tiny-invariant'

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.slug, 'slug should be defined')
  const workspace = await prisma.workspace.findUnique({ where: { slug: params.slug } })
  if (!workspace) {
    return redirect('/404', { status: 404 })
  }
  return workspace
}

export default function WorkspaceLayout() {
  const workspace = useLoaderData<typeof loader>()

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <div className="rounded-md border border-accent/20 bg-accent/10 p-2 text-accent">
          <PackageSearchIcon className="size-9" strokeWidth={1.25} />
        </div>
        <div>
          <div className="text-xl font-medium">{workspace.name}</div>
          <div className="text-muted-foreground">Browse your entire bookmarked collection</div>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
