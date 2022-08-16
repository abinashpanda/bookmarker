import clsx from 'clsx'
import { LoaderProps } from './props'

export default function BookmarkLoader({ className, style }: LoaderProps) {
  return (
    <div className={clsx('flex overflow-hidden rounded border text-text-primary/10', className)} style={style}>
      <div className="h-[140px] w-40 animate-pulse bg-current" />
      <div className="flex flex-1 flex-col px-4 py-2">
        <div className="mb-2 h-5 w-full animate-pulse rounded bg-current" />
        <div className="h-3 w-7/12 animate-pulse rounded bg-current" />
        <div className="flex-1" />
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-pulse rounded-full bg-current" />
          <div className="h-4 w-10 animate-pulse rounded bg-current" />
        </div>
      </div>
    </div>
  )
}
