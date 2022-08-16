import clsx from 'clsx'
import { HiExternalLink } from 'react-icons/hi'
import { Bookmark } from 'types/bookmark.types'

type BookmarkCardProps = {
  bookmark: Bookmark
  className?: string
  style?: React.CSSProperties
}

export default function BookmarkCard({ bookmark, className, style }: BookmarkCardProps) {
  return (
    <div className={clsx('group relative flex items-center rounded border', className)} style={style} tabIndex={0}>
      <div className="min-h-[120px] w-32 self-stretch overflow-hidden rounded-l border-r">
        <img src={bookmark.image ?? 'logo-light.svg'} className="h-full w-full object-cover" />
      </div>
      <div className="p-4">
        <div className="font-medium">{bookmark.title}</div>
        {bookmark.description ? <div className="mt-1 text-sm text-text-secondary">{bookmark.description}</div> : null}
        <div className="mt-4 flex items-center space-x-2 text-text-secondary">
          <img className="h-4 w-4 rounded-full border object-cover" src={bookmark.site.favicon} />
          <div className="truncate text-xs">{bookmark.site.name ?? bookmark.site.url}</div>
        </div>
      </div>
      <a
        href={bookmark.site.url}
        target="_blank"
        rel="noreferrer"
        className="absolute top-2 right-2 flex items-center space-x-2 rounded-md border px-2 py-1 text-sm opacity-0 transition-opacity duration-100 group-hover:opacity-100 group-focus-visible:opacity-100"
        tabIndex={-1}
      >
        <HiExternalLink className="h-4 w-4" />
        <span>Read</span>
      </a>
    </div>
  )
}
