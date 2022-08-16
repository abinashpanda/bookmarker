import { cloneElement } from 'react'
import { HiExclamation } from 'react-icons/hi'

type FieldProps = {
  name: string
  label: string
  errorMessage?: string
  children: React.ReactElement<{ id: string }>
  className?: string
  style?: React.CSSProperties
}

export default function Field({ name, label, errorMessage, children, className, style }: FieldProps) {
  return (
    <div className={className} style={style}>
      <label htmlFor={name} className="mb-1.5 block text-xs font-medium">
        {label}
      </label>
      {cloneElement(children, { id: name })}
      {errorMessage ? (
        <div className="mt-1.5 flex items-center space-x-1 text-xs font-medium text-text-error">
          <HiExclamation className="h-4 w-4" />
          <span>{errorMessage}</span>
        </div>
      ) : null}
    </div>
  )
}
