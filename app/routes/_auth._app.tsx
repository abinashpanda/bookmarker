import { Form, Link, Outlet, useLoaderData, useNavigate, useNavigation, useParams } from '@remix-run/react'
import { authenticator } from '@/services/auth.server'
import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
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
import { AlbumIcon, CheckIcon, ChevronUpIcon, LibraryBigIcon, MoonIcon, PackageSearchIcon, SunIcon } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { Theme, useTheme } from 'remix-themes'
import { cloneElement } from 'react'
import invariant from 'tiny-invariant'
import { prisma } from '@/services/db.server'
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select'

export const meta: MetaFunction = () => {
  return [{ title: 'Bookmarker' }, { name: 'description', content: 'Your AI powered bookmark organizer' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)
  invariant(user, 'user should be authenticated')
  const userWorkspaces = await prisma.workspaceUserAssociation.findMany({
    where: {
      userId: user.id,
    },
    include: {
      workspace: true,
    },
  })
  return json({ user, userWorkspaces })
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
  const [theme, setTheme] = useTheme()

  const { user, userWorkspaces } = useLoaderData<typeof loader>()

  const navigation = useNavigation()
  const navigate = useNavigate()
  const { slug } = useParams<{ slug?: string }>()

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
              <Select
                value={slug}
                onValueChange={(slug) => {
                  if (slug === 'add') {
                    navigate('/create-workspace')
                  } else {
                    navigate(`/w/${slug}`)
                  }
                }}
              >
                <SelectTrigger className="justify-start gap-2">
                  <PackageSearchIcon className="size-5" />
                  <div className="flex-1 text-left">
                    <SelectValue placeholder="Workspace" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {userWorkspaces.map((userWorkspace) => {
                    return (
                      <SelectItem key={userWorkspace.id} value={userWorkspace.workspace.slug}>
                        {userWorkspace.workspace.name}
                      </SelectItem>
                    )
                  })}
                  <SelectSeparator />
                  <SelectItem value="add">Add Workspace</SelectItem>
                </SelectContent>
              </Select>
            </SidebarGroupContent>
          </SidebarGroup>
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
        <div className="sticky top-0 mx-auto px-4 py-2">
          <SidebarTrigger />
        </div>
        <div className="mx-auto max-w-screen-2xl px-4">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  )
}
