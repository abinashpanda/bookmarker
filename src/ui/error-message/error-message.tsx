import clsx from 'clsx'
import { HiExclamation } from 'react-icons/hi'

type ErrorMessageProps = {
  message?: string
  className?: string
  style?: React.CSSProperties
}

export default function ErrorMessage({
  message = 'Something went wrong. Please try again',
  className,
  style,
}: ErrorMessageProps) {
  return (
    <div className={clsx('flex flex-col items-center justify-center rounded-md border p-8', className)} style={style}>
      <HiExclamation className="mb-1 h-12 w-12" />
      <div className="text-sm font-medium text-text-secondary">{message}</div>
    </div>
  )
}
