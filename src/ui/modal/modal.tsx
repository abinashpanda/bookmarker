import { Transition, Dialog } from '@headlessui/react'
import { HiCheck, HiOutlineX, HiX } from 'react-icons/hi'
import clsx from 'clsx'
import { Fragment } from 'react'
import Button, { ButtonProps } from 'ui/button'

type ModalProps = {
  visible: boolean
  onRequestClose: () => void
  cancelButtonProps?: Omit<ButtonProps, 'onClick'>
  onOk?: () => void
  okButtonProps?: Omit<ButtonProps, 'onClick'>
  title?: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function Modal({
  visible,
  onRequestClose,
  cancelButtonProps = {},
  onOk,
  okButtonProps = {},
  title,
  children,
  className,
  style,
}: ModalProps) {
  return (
    <Transition appear show={visible} as={Fragment}>
      <Dialog
        open={visible}
        onClose={onRequestClose}
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/80" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div
            className={clsx(
              'relative z-50 w-[calc(100vw-32px)] rounded-md bg-background text-text-primary lg:w-[560px]',
              className,
            )}
            style={style}
          >
            {title ? (
              <Dialog.Title as="h3" className="border-b px-4 py-3 text-sm font-semibold">
                {title}
              </Dialog.Title>
            ) : null}
            <div className="max-h-[480px] overflow-auto px-5 py-4 lg:max-h-[600px]">{children}</div>
            <div className="flex items-center justify-end space-x-2 border-t p-2">
              <Button icon={<HiCheck />} size="small" onClick={onOk} buttonType="secondary" {...okButtonProps}>
                OK
              </Button>
              <Button
                icon={<HiX />}
                size="small"
                onClick={onRequestClose}
                buttonType="secondary"
                {...cancelButtonProps}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Transition.Child>
        <button onClick={onRequestClose} className="fixed top-4 right-4 rounded-sm p-2 text-text-on-primary">
          <HiOutlineX size={24} />
        </button>
      </Dialog>
    </Transition>
  )
}
