import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { scrapeUrl } from '@/services/scrape.server'
import { zodResolver } from '@hookform/resolvers/zod'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import { HashIcon } from 'lucide-react'
import { useMemo } from 'react'
import { getValidatedFormData, RemixFormProvider, useRemixForm } from 'remix-hook-form'
import { z } from 'zod'

const addBookmarkSchema = z.object({
  url: z.string().url(),
})
const resolver = zodResolver(addBookmarkSchema)

export async function action({ request }: ActionFunctionArgs) {
  const {
    errors,
    receivedValues: defaultValues,
    data,
  } = await getValidatedFormData<z.infer<typeof addBookmarkSchema>>(request, resolver)
  if (errors) {
    return json({ errors, defaultValues })
  }
  const scrappedData = await scrapeUrl(data.url)
  return json(scrappedData)
}

export default function CreateBookmark() {
  const form = useRemixForm<z.infer<typeof addBookmarkSchema>>({
    resolver,
    defaultValues: {
      url: '',
    },
  })

  const navigation = useNavigation()

  const actionData = useActionData<typeof action>()

  const urlContent = useMemo(() => {
    if (!actionData || !('result' in actionData)) {
      return null
    }

    const { result, url } = actionData

    return (
      <Card>
        <CardHeader>
          <CardDescription className="text-xs uppercase">{url}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row">
          <img
            src={result.image}
            alt={result.title}
            className="aspect-video h-48 rounded-md object-cover object-left-top"
          />
          <div className="flex-1">
            <CardTitle className="mb-2">{result.title}</CardTitle>
            <CardDescription className="mb-4">{result.summary}</CardDescription>
            <div className="flex flex-wrap gap-2 md:gap-4">
              {result.tags.map((tag) => {
                return (
                  <div
                    key={tag}
                    className="flex items-center gap-1 rounded-full border border-accent/15 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent"
                  >
                    <HashIcon className="size-4" />
                    <div>{tag}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }, [actionData])

  return (
    <div className="space-y-6">
      <RemixFormProvider {...form}>
        <Form method="POST" onSubmit={form.handleSubmit} className="flex flex-col gap-4 md:flex-row md:items-end">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => {
              return (
                <FormItem className="flex-1">
                  <FormLabel>Add URL to Bookmark</FormLabel>
                  <FormControl>
                    <Input placeholder="URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <Button loading={!!navigation.formAction}>Add Bookmark</Button>
        </Form>
      </RemixFormProvider>
      {urlContent}
    </div>
  )
}
