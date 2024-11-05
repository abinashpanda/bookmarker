import { forwardRef, useState } from 'react'
import { EyeIcon, EyeOffIcon, SearchIcon } from 'lucide-react'
import { match } from 'ts-pattern'
import { cn } from '@/lib/utils'
import { Toggle } from './toggle'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  addonBefore?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, style, type, addonBefore, ...props }, ref) => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  return (
    <div
      className={cn(
        'flex h-9 w-full items-center overflow-hidden rounded-md border border-input bg-transparent text-sm focus-within:outline-none focus-within:ring-1 focus-within:ring-ring',
        className,
      )}
      style={style}
    >
      {addonBefore ? (
        <div className="flex flex-shrink-0 items-center justify-center self-stretch">{addonBefore}</div>
      ) : null}
      <input
        type={type === 'password' ? (passwordVisible ? 'text' : 'password') : type}
        className="flex h-full min-w-0 flex-1 appearance-none bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        ref={ref}
        {...props}
      />
      {match(type)
        .with('password', () => (
          <Toggle size="sm" pressed={passwordVisible} onPressedChange={setPasswordVisible} disabled={props.disabled}>
            {passwordVisible ? (
              <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
            ) : (
              <EyeIcon className="h-4 w-4 text-muted-foreground" />
            )}
          </Toggle>
        ))
        .with('search', () => (
          <div className="flex flex-shrink-0 items-center justify-center self-stretch px-2 text-muted-foreground">
            <SearchIcon className="h-4 w-4" />
          </div>
        ))
        .otherwise(() => null)}
    </div>
  )
})

Input.displayName = 'Input'
export { Input }
