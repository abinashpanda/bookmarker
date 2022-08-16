import clsx from 'clsx'
import { HiColorSwatch } from 'react-icons/hi'

type EmptyProps = {
  message?: string
  className?: string
  style?: React.CSSProperties
}

export default function Empty({ message = 'No items found', className, style }: EmptyProps) {
  return (
    <div className={clsx('flex flex-col items-center justify-center rounded-md border p-8', className)} style={style}>
      <HiColorSwatch className="mb-1 h-12 w-12" />
      <div className="text-sm font-medium text-text-secondary">{message}</div>
    </div>
  )
}
