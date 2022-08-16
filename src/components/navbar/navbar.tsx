import { HiPlus } from 'react-icons/hi'

const NAVBAR_HEIGHT = 64

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-white/30 px-4 backdrop-blur" style={{ height: NAVBAR_HEIGHT }}>
      <div className="mx-auto flex h-full max-w-screen-lg items-center">
        <img src="logo-light.svg" className="mr-2 h-10 w-10" />
        <span className="text-2xl font-bold tracking-tight">Bookmarker</span>
        <span className="flex-1" />
        <button className="flex items-center space-x-2 rounded-md border bg-brand-primary px-3 py-1 text-text-on-primary">
          <HiPlus />
          <span className="font-medium">Bookmark</span>
        </button>
      </div>
    </div>
  )
}

Navbar.HEIGHT = NAVBAR_HEIGHT
