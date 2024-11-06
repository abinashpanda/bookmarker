import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ActionFunctionArgs, json, type LoaderFunctionArgs, MetaFunction, redirect } from '@remix-run/node'
import { Form, useLoaderData, useNavigation } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { z } from 'zod'
import { authenticator } from '@/services/auth.server'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRemixForm, RemixFormProvider, getValidatedFormData } from 'remix-hook-form'
import { type FieldError } from 'react-hook-form'
import { FormField, FormControl, FormMessage, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { prisma } from '@/services/db.server'
import { useMemo } from 'react'
import { getDomainNameFromEmail, slugify } from '@/lib/utils'

export const meta: MetaFunction = () => {
  return [{ title: 'Onboarding' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)
  invariant(user, 'user should be authenticated')
  return user
}

const validationSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
})
const resolver = zodResolver(validationSchema)

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)
  invariant(user, 'user should be authenticated')
  const {
    errors,
    receivedValues: defaultValues,
    data,
  } = await getValidatedFormData<z.infer<typeof validationSchema>>(request, resolver)
  if (errors) {
    return json({ errors, defaultValues })
  }
  const workspace = await prisma.workspace.findUnique({ where: { slug: data.slug } })
  if (workspace) {
    return json({
      errors: { slug: { message: 'Workspace already exists', type: 'custom' } } as Record<string, FieldError>,
      defaultValues,
    })
  }
  const workspaceCreated = await prisma.workspace.create({
    data: {
      name: data.name,
      slug: data.slug,
      createdByUserId: user.id,
    },
  })
  const isOrgUser = getDomainNameFromEmail(user.email) !== 'gmail.com'
  if (isOrgUser) {
    return redirect('/onboarding/org')
  }
  return redirect(`/w/${workspaceCreated.slug}`)
}

export default function Onboarding() {
  const user = useLoaderData<typeof loader>()
  const defaultColletionName = useMemo(() => `${user.name.split(' ')[0]} Collection`, [user.name])

  const form = useRemixForm<z.infer<typeof validationSchema>>({
    resolver,
    mode: 'onSubmit',
    defaultValues: {
      name: defaultColletionName,
      slug: slugify(defaultColletionName),
    },
  })
  const navigation = useNavigation()

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <Logo className="mb-2 size-10" />
          <CardTitle>Welcome to Bookmarker</CardTitle>
          <CardDescription>Let&apos;s get you set up with a workspace</CardDescription>
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
    </div>
  )
}
