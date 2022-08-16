import clsx from 'clsx'
import { cloneElement } from 'react'
import Spinner from 'ui/spinner'

export type ButtonProps = Omit<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  'children'
> & {
  icon?: React.ReactElement<{ className?: string; style?: React.CSSProperties }>
  children?: string
  buttonType?: 'primary' | 'secondary'
  size?: 'small' | 'medium'
  loading?: boolean
}

export default function Button({
  icon,
  children,
  buttonType = 'primary',
  size = 'medium',
  loading,
  className,
  ...restProps
}: ButtonProps) {
  const isIconOnlyButton = !!icon && !children

  return (
    <button
      className={clsx(
        'flex items-center border',
        (() => {
          switch (size) {
            case 'small': {
              return clsx('space-x-1.5 rounded py-1.5', isIconOnlyButton ? 'px-1.5' : 'px-2')
            }

            case 'medium': {
              return clsx('space-x-2 rounded-md py-2', isIconOnlyButton ? 'px-2' : 'px-3')
            }

            default: {
              return undefined
            }
          }
        })(),
        (() => {
          switch (buttonType) {
            case 'primary': {
              return 'bg-brand-primary text-text-on-primary'
            }

            case 'secondary': {
              return 'border text-text-primary'
            }

            default: {
              return undefined
            }
          }
        })(),
        className,
      )}
      {...restProps}
    >
      {loading ? (
        <Spinner className="h-4 w-4" />
      ) : icon ? (
        cloneElement(icon, { className: clsx('w-4 h-4', icon.props.className) })
      ) : null}
      {children ? (
        <span
          className={(() => {
            switch (size) {
              case 'small': {
                return 'text-xs'
              }

              case 'medium': {
                return 'text-sm'
              }

              default: {
                return undefined
              }
            }
          })()}
        >
          {children}
        </span>
      ) : null}
    </button>
  )
}
