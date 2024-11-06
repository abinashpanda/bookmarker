import { Form, Link, Outlet, useLoaderData, useNavigation } from '@remix-run/react'
import { authenticator } from '@/services/auth.server'
import { redirect, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Logo } from '@/components/ui/logo'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import { AlbumIcon, CheckIcon, ChevronUpIcon, LibraryBigIcon, MoonIcon, SunIcon } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { Theme, useTheme } from 'remix-themes'
import { cloneElement } from 'react'

export const meta: MetaFunction = () => {
  return [{ title: 'Bookmarker' }, { name: 'description', content: 'Your AI powered bookmark organizer' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }
  return user
}

const THEME_CONF: Record<Theme, { label: string; icon: React.ReactElement<{ className?: string }> }> = {
  [Theme.LIGHT]: {
    label: 'Light',
    icon: <SunIcon />,
  },
  [Theme.DARK]: {
    label: 'Dark',
    icon: <MoonIcon />,
  },
}
const THEMES: Theme[] = [Theme.LIGHT, Theme.DARK]

export default function AppLayout() {
  const user = useLoaderData<typeof loader>()

  const navigation = useNavigation()

  const [theme, setTheme] = useTheme()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-4">
            <Logo className="size-8" />
            <div className="font-medium">Bookmarker</div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenuButton asChild>
                <Link to="/add">
                  <AlbumIcon />
                  <span>Add Bookmark</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild>
                <Link to="/add">
                  <LibraryBigIcon />
                  <span>Add Collection</span>
                </Link>
              </SidebarMenuButton>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Collections</SidebarGroupLabel>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                {user.photo ? (
                  <img src={user.photo} alt={user.name} className="size-6 rounded-full object-cover" />
                ) : null}
                <div className="flex-1">{user.name}</div>
                <ChevronUpIcon className="size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
              <DropdownMenuItem>Account</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {THEMES.map((t) => {
                    return (
                      <DropdownMenuItem
                        key={t}
                        onClick={() => {
                          setTheme(t)
                        }}
                      >
                        {cloneElement(THEME_CONF[t].icon, { className: 'size-4' })}
                        <span className="flex-1">{THEME_CONF[t].label}</span>
                        {theme === t ? <CheckIcon className="size-4" /> : null}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />
              <Form method="POST" className="w-full" action="/auth/logout">
                <DropdownMenuItem asChild className="w-full">
                  <button type="submit">
                    <span>Logout</span>
                    {navigation.formAction === '/auth/logout' ? <Spinner /> : null}
                  </button>
                </DropdownMenuItem>
              </Form>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <div className="relative flex-1 overflow-auto">
        <div className="sticky top-0 px-4 py-2">
          <SidebarTrigger />
        </div>
        <div className="px-4">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  )
}
