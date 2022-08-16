import clsx from 'clsx'
import { HiExternalLink, HiFolderOpen, HiShare } from 'react-icons/hi'
import { Bookmark } from 'types/bookmark.types'

type BookmarkCardProps = {
  bookmark: Bookmark
  className?: string
  style?: React.CSSProperties
}

export default function BookmarkCard({ bookmark, className, style }: BookmarkCardProps) {
  return (
    <a
      className={clsx('group relative flex rounded border', className)}
      style={style}
      href={bookmark.site.url}
      target="_blank"
      rel="noreferrer"
    >
      <div className="max-h-[160px] min-h-[140px] w-40 overflow-hidden rounded-l border-r">
        <img src={bookmark.image ?? 'logo-light.svg'} className="h-full object-cover object-center" />
      </div>
      <div className="flex flex-col overflow-hidden px-4 py-2">
        <div className="font-semibold">{bookmark.title}</div>
        {bookmark.description ? <div className="text-sm text-text-secondary">{bookmark.description}</div> : null}
        <div className="flex-1" />
        <div className="mb-4 flex items-center space-x-2 text-text-secondary">
          <img className="h-4 w-4 rounded-full border object-cover" src={bookmark.site.favicon} />
          <div className="truncate text-xs">{bookmark.site.name ?? bookmark.site.url}</div>
        </div>
        <div className="-mb-10 flex transform items-center space-x-4 transition-all duration-100 group-focus-within:mb-0 group-hover:mb-0 group-focus-visible:mb-0">
          <button className="flex items-center space-x-2 rounded border px-2 py-1.5">
            <HiShare />
            <span className="text-xs font-medium">Share</span>
          </button>
          <button className="flex items-center space-x-2 rounded border px-2 py-1.5">
            <HiFolderOpen />
            <span className="text-xs font-medium">Move</span>
          </button>
        </div>
      </div>
      <div className="absolute top-2 right-2 flex items-center space-x-2 rounded-md border px-2 py-1 text-sm opacity-0 transition-opacity duration-100 group-hover:opacity-100 group-focus-visible:opacity-100">
        <HiExternalLink className="h-4 w-4" />
        <span>Read</span>
      </div>
    </a>
  )
}
