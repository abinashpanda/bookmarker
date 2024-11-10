import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/ui/logo'
import { Nullable } from '@/lib/types'
import { capitalize, getDomainNameFromEmail, slugify } from '@/lib/utils'
import { authenticator } from '@/services/auth.server'
import { prisma } from '@/services/db.server'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ActionFunctionArgs, json, redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { Form, Link, useLoaderData, useNavigation } from '@remix-run/react'
import { useMemo } from 'react'
import { FieldError } from 'react-hook-form'
import { getValidatedFormData, RemixFormProvider, useRemixForm } from 'remix-hook-form'
import invariant from 'tiny-invariant'
import { match } from 'ts-pattern'
import { z } from 'zod'

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)
  invariant(user, 'user should be authenticated')

  const domain = getDomainNameFromEmail(user.email)
  if (domain === 'gmail.com') {
    return redirect('/')
  }

  const workspace = await prisma.workspace.findFirst({ where: { domain } })
  if (!workspace) {
    return json({ type: 'create-workspace' as const, domain })
  }

  const userWorkspaceAssociation = await prisma.workspaceUserAssociation.findUnique({
    where: {
      workspaceId_userId: {
        userId: user.id,
        workspaceId: workspace.id,
      },
    },
  })
  if (!userWorkspaceAssociation) {
    const members = await prisma.workspaceUserAssociation.findMany({
      where: {
        workspaceId: workspace.id,
      },
      include: {
        user: {
          select: {
            name: true,
            photo: true,
          },
        },
      },
      take: 5,
    })
    return json({ type: 'join-workspace' as const, workspace, members })
  }

  return redirect(`/w/${workspace.slug}`)
}

const schema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('create-workspace'),
    name: z.string().min(1),
    slug: z.string().min(1),
    domain: z.string().min(1),
  }),
  z.object({
    type: z.literal('join-workspace'),
    workspaceId: z.string(),
  }),
])
const resolver = zodResolver(schema)

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)
  invariant(user, 'user should be authenticated')
  const {
    errors,
    receivedValues: defaultValues,
    data,
  } = await getValidatedFormData<z.infer<typeof schema>>(request, resolver)
  if (errors) {
    return json({ errors, defaultValues })
  }

  return match(data)
    .with({ type: 'create-workspace' }, async ({ slug, name, domain }) => {
      if (await prisma.workspace.findUnique({ where: { slug: slug } })) {
        return json({
          errors: { slug: { message: 'Workspace already exists', type: 'custom' } } as Record<string, FieldError>,
          defaultValues,
        })
      }
      const workspace = await prisma.$transaction(async (tx) => {
        const workspace = await tx.workspace.create({
          data: {
            name,
            slug,
            domain,
            createdByUserId: user.id,
            type: 'ORGANIZATION',
          },
        })
        await tx.workspaceUserAssociation.create({
          data: {
            userId: user.id,
            workspaceId: workspace.id,
          },
        })
        return workspace
      })
      return redirect(`/w/${workspace.slug}`)
    })
    .with({ type: 'join-workspace' }, async ({ workspaceId }) => {
      const { workspace } = await prisma.workspaceUserAssociation.create({
        data: {
          userId: user.id,
          workspaceId,
        },
        include: {
          workspace: true,
        },
      })
      return redirect(`/w/${workspace.slug}`)
    })
    .exhaustive()
}

export default function OnboardingOrg() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <Logo className="mb-2 size-10" />
          <CardTitle>Share Your Knowledge with Your Team</CardTitle>
          <CardDescription>Unlock the full potential of your bookmark collection</CardDescription>
        </CardHeader>
        <CardContent>
          {match(data)
            .returnType<React.ReactNode>()
            .with({ type: 'create-workspace' }, ({ domain }) => {
              return <CreateWorkspaceForm domain={domain} />
            })
            .with({ type: 'join-workspace' }, ({ workspace, members }) => {
              return <JoinWorkspaceForm workspace={workspace} members={members} />
            })
            .otherwise(() => null)}
        </CardContent>
      </Card>
      <Link to="/" className="text-xs text-muted-foreground">
        Skip
      </Link>
    </div>
  )
}

type CreateWorkspaceFormProps = {
  domain: string
}

function CreateWorkspaceForm({ domain }: CreateWorkspaceFormProps) {
  const defaultColletionName = useMemo(() => `${capitalize(domain.split('.')[0])} Collection`, [domain])

  const form = useRemixForm<z.infer<typeof schema>>({
    resolver,
    mode: 'onSubmit',
    defaultValues: {
      type: 'create-workspace',
      domain,
      name: defaultColletionName,
      slug: slugify(defaultColletionName),
    },
  })

  const navigation = useNavigation()

  return (
    <RemixFormProvider {...form}>
      <Form onSubmit={form.handleSubmit} method="POST" className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Workspace Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      const slug = slugify(event.target.value)
                      form.setValue('slug', slug)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className="flex">
                    <div className="flex items-center rounded-md rounded-r-none border border-r-0 bg-muted px-2 text-xs text-muted-foreground">
                      bookmarker.prodioslabs.com/w/
                    </div>
                    <Input placeholder="" className="rounded-l-none" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <Button className="w-full" type="submit" loading={!!navigation.formAction} disabled={!!navigation.formAction}>
          Create Workspace
        </Button>
      </Form>
    </RemixFormProvider>
  )
}

type JoinWorkspaceFormProps = {
  workspace: { name: string; id: string }
  members: { user: { name: string; photo: Nullable<string> } }[]
}

function JoinWorkspaceForm({ workspace, members }: JoinWorkspaceFormProps) {
  const navigation = useNavigation()

  return (
    <div className="space-y-2">
      <Form method="POST">
        <input className="hidden" name="workspaceId" defaultValue={workspace.id} />
        <input className="hidden" name="type" defaultValue="join-workspace" />
        <Button type="submit" className="w-full" loading={!!navigation.formAction}>
          Join {workspace.name}
        </Button>
      </Form>
      {members.length ? (
        <div className="text-center text-xs text-muted-foreground">
          {members.map(({ user }) => user.name.split(' ')[0]).join(', ')} have already joined
        </div>
      ) : null}
    </div>
  )
}
