import CreateBookmarkButton from 'components/create-bookmark-button'
import Link from 'next/link'

const NAVBAR_HEIGHT = 64

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-white/30 px-4 backdrop-blur" style={{ height: NAVBAR_HEIGHT }}>
      <div className="mx-auto flex h-full max-w-screen-lg items-center">
        <Link href="/">
          <a className="flex items-center space-x-2 rounded">
            <img src="logo-light.svg" className="h-10 w-10" />
            <span className="text-2xl font-bold tracking-tight">Bookmarker</span>
          </a>
        </Link>
        <span className="flex-1" />
        <CreateBookmarkButton />
      </div>
    </div>
  )
}

Navbar.HEIGHT = NAVBAR_HEIGHT
