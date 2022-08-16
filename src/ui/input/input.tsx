import clsx from 'clsx'

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export default function Input({ className, ...restProps }: InputProps) {
  return <input className={clsx('rounded border px-3 py-2 text-sm', className)} {...restProps} />
}
