import { BaseButton, Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/ui/logo'
import { Textarea } from '@/components/ui/textarea'
import { slugify } from '@/lib/utils'
import { authenticator } from '@/services/auth.server'
import { prisma } from '@/services/db.server'
import { zodResolver } from '@hookform/resolvers/zod'
import { json, redirect, type ActionFunctionArgs } from '@remix-run/node'
import { Form, Link, useActionData, useNavigation } from '@remix-run/react'
import { type FieldError } from 'react-hook-form'
import { getValidatedFormData, RemixFormProvider, useRemixForm } from 'remix-hook-form'
import invariant from 'tiny-invariant'
import { match } from 'ts-pattern'
import { z } from 'zod'

const schema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('create-workspace'),
    name: z.string().min(1),
    slug: z.string().min(1),
  }),
  z.object({
    type: z.literal('invite-users'),
    workspaceSlug: z.string(),
    emails: z.string().refine((value) => {
      return value.split(',').every((email) => {
        return z.string().email().safeParse(email.trim()).success
      })
    }, 'Invalid email. Please make sure all emails are valid'),
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
    .with({ type: 'create-workspace' }, async ({ slug, name }) => {
      if (await prisma.workspace.findUnique({ where: { slug } })) {
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
            createdByUserId: user.id,
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

      return json({ type: 'workspace-created' as const, workspace })
    })
    .with({ type: 'invite-users' }, ({ workspaceSlug }) => {
      // TODO: Implement invite user
      return redirect(`/w/${workspaceSlug}`)
    })
    .exhaustive()
}

export default function CreateWorkspace() {
  const actionData = useActionData<typeof action>()
  const shouldShowInviteForm = actionData && 'type' in actionData && actionData.type === 'workspace-created'

  return (
    <div className="flex h-screen items-center justify-center">
      {shouldShowInviteForm ? <InviteUsersForm workspace={actionData.workspace} /> : <CreateWorkspaceForm />}
    </div>
  )
}

function CreateWorkspaceForm() {
  const form = useRemixForm<z.infer<typeof schema>>({
    resolver,
    mode: 'onSubmit',
    defaultValues: {
      type: 'create-workspace',
      name: '',
      slug: '',
    },
  })

  const navigation = useNavigation()

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <Logo className="mb-2 size-10" />
        <CardTitle>Create a workspace</CardTitle>
        <CardDescription>Store, organize and discover your bookmarks</CardDescription>
      </CardHeader>
      <CardContent>
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
            <Button
              className="w-full"
              type="submit"
              loading={!!navigation.formAction}
              disabled={!!navigation.formAction}
            >
              Create Workspace
            </Button>
          </Form>
        </RemixFormProvider>
      </CardContent>
    </Card>
  )
}

type InviteUsersFormProps = { workspace: { id: string; name: string; slug: string } }

function InviteUsersForm({ workspace }: InviteUsersFormProps) {
  const form = useRemixForm<z.infer<typeof schema>>({
    resolver,
    mode: 'onSubmit',
    defaultValues: {
      type: 'invite-users',
      workspaceSlug: workspace.slug,
      emails: '',
    },
  })

  const navigation = useNavigation()

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <Logo className="mb-2 size-10" />
        <CardTitle>Invite people</CardTitle>
        <CardDescription>Share Your Discoveries with Others: Invite Friends to Join</CardDescription>
      </CardHeader>
      <CardContent>
        <RemixFormProvider {...form}>
          <Form onSubmit={form.handleSubmit} method="POST" className="space-y-4">
            <FormField
              control={form.control}
              name="emails"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Emails</FormLabel>
                    <FormDescription>Please separate the emails with comma (,) instead of spaces</FormDescription>
                    <FormControl>
                      <Textarea placeholder="Emails" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <Button
              className="w-full"
              type="submit"
              loading={!!navigation.formAction}
              disabled={!!navigation.formAction}
            >
              Invite Users
            </Button>
            <BaseButton asChild variant="link" className="w-full">
              <Link to={`/w/${workspace.slug}`}>Skip this step</Link>
            </BaseButton>
          </Form>
        </RemixFormProvider>
      </CardContent>
    </Card>
  )
}
