import { Transition, Dialog } from '@headlessui/react'
import { HiOutlineX } from 'react-icons/hi'
import clsx from 'clsx'
import { Fragment } from 'react'

type ModalProps = {
  visible: boolean
  onRequestClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function Modal({ visible, onRequestClose, title, children, className, style }: ModalProps) {
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
              'relative z-50 w-[calc(100vw-32px)] rounded-md bg-background text-text-primary lg:w-[32rem]',
              className,
            )}
            style={style}
          >
            {title ? (
              <Dialog.Title as="h3" className="border-b px-4 py-3 text-sm font-semibold">
                {title}
              </Dialog.Title>
            ) : null}
            <div className="max-h-[480px] overflow-auto lg:max-h-[600px]">{children}</div>
          </div>
        </Transition.Child>
        <button onClick={onRequestClose} className="fixed top-4 right-4 rounded-sm p-2 text-text-on-primary">
          <HiOutlineX size={24} />
        </button>
      </Dialog>
    </Transition>
  )
}
