import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Logo } from '@/components/ui/logo'
import { authenticator } from '@/services/auth.server'
import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { BookmarkIcon, SearchIcon, StarIcon } from 'lucide-react'

export async function loader({ request }: LoaderFunctionArgs) {
  const isAuthenticated = await authenticator.isAuthenticated(request)
  if (isAuthenticated) {
    return redirect('/')
  }
  return {}
}

export default function Login() {
  return (
    <div className="flex h-screen items-center justify-center text-center">
      <Card>
        <CardHeader>
          <Logo className="mx-auto size-12" />
          <CardTitle>Bookmarker</CardTitle>
          <CardDescription>Your AI-powered bookmark organizer</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="POST" action="/auth/google">
            <Button
              icon={
                <svg viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
              }
              variant="default"
              className="mb-6 w-full"
            >
              Login with Google
            </Button>
          </Form>
          <CardDescription className="mb-6">Store, organize, and search your bookmarks with ease</CardDescription>
          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-2 text-sm">
              <div className="flex animate-bounce items-center justify-center rounded-full border bg-muted p-2">
                <BookmarkIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">Organize</div>
            </div>
            <div className="flex flex-col items-center gap-2 text-sm">
              <div className="flex animate-bounce items-center justify-center rounded-full border bg-muted p-2 [animation-duration:1.5s]">
                <SearchIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">AI Search</div>
            </div>
            <div className="flex flex-col items-center gap-2 text-sm">
              <div className="flex animate-bounce items-center justify-center rounded-full border bg-muted p-2 [animation-duration:2s]">
                <StarIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">Discover</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
